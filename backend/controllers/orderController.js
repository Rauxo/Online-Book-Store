const Order = require("../models/Order");
const crypto = require("crypto");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const axios = require("axios");

const cashfree = new Cashfree(
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY,
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
);

exports.createCashfreeOrder = async (req, res) => {
  const { amount, bookId } = req.body;

  try {
    const orderData = {
      order_id: `order_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: req.user.name,
        customer_email: req.user.email,
        customer_phone: req.body.customer_phone || "9999999999",
      },
      order_meta: {
        return_url: `http://localhost:5173/verify-payment?order_id={order_id}`,
      },
      order_note: JSON.stringify({ bookId }), // Store bookId here
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      orderData,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log("Cashfree Error:", error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};
// console.log("SECRET:", process.env.CASHFREE_SECRET_KEY);
exports.verifyCashfreePayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // 🔥 Call Cashfree API to verify payment
    const paymentResponse = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      },
    );

    // 🔥 Also fetch Order details to get order_note (where we stored bookId)
    const orderResponse = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      },
    );

    //
    const payments = paymentResponse.data.data || paymentResponse.data;
    const cfOrder = orderResponse.data;
    // const orderNote = cfOrder.order_note ? JSON.parse(cfOrder.order_note) : {};
    let orderNote = {};

    try {
      if (cfOrder.order_note) {
        let cleanNote = cfOrder.order_note
          .replace(/&quot;/g, '"') // decode HTML quotes
          .replace(/&amp;/g, "&");

        orderNote = JSON.parse(cleanNote);
      }
    } catch (err) {
      console.log("⚠️ order_note parse failed:", cfOrder.order_note);
    }
    // const bookId = orderNote.bookId;
    const bookIdFromQuery = req.query.bookId;
    const bookId = orderNote.bookId || bookIdFromQuery;
    if (!bookId) {
      console.log("❌ BookId missing!", {
        orderNote,
        query: req.query,
        rawNote: cfOrder.order_note,
      });

      return res.status(400).json({
        message: "Book ID missing — cannot create order",
      });
    }

    // ✅ find successful payment
    const successPayment = payments.find((p) => p.payment_status === "SUCCESS");

    if (!successPayment) {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // ⚠️ avoid duplicate
    const existing = await Order.findOne({ cashfreeOrderId: orderId });
    if (existing) {
      return res.json(existing);
    }

    // ✅ create order
    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          book: bookId || null,
          quantity: 1,
        },
      ],
      totalPrice: successPayment.order_amount,
      address: {
        street: "Auto",
        city: "Auto",
        zipCode: "000000",
        country: "India",
      },
      phone:
        successPayment?.customer_details?.customer_phone ||
        cfOrder?.customer_details?.customer_phone ||
        "9999999999",
      status: "Paid",
      cashfreeOrderId: orderId,
      paymentId: successPayment.cf_payment_id,
    });

    res.json(order);
  } catch (error) {
    console.error("❌ Verify Error:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const {
    items,
    address,
    phone,
    totalPrice,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;
  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }
    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      phone,
      totalPrice,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: "Paid", // If creating after successful payment
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.book");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "id name email")
      .populate("items.book");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order stats (Admin only)
// @route   GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    res.json(stats[0] || { totalIncome: 0, totalOrders: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Cashfree Order
// @route   POST /api/orders/cashfree
// exports.createCashfreeOrder = async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const request = {
//       order_id: `order_${Date.now()}`,
//       order_amount: amount,
//       order_currency: "INR",
//       customer_details: {
//         customer_id: req.user._id.toString(),
//         customer_name: req.user.name,
//         customer_email: req.user.email,
//         customer_phone: "9999999999",
//       },
//       order_meta: {
//         return_url: "http://localhost:5173/profile",
//       },
//     };

//     // ✅ Correct method
//     const response = await cashfree.createOrder(request);

//     res.json(response.data);
//   } catch (error) {
//     console.log("Cashfree Error:", error.response?.data || error.message);
//     res.status(500).json({
//       message: error.response?.data?.message || error.message,
//     });
//   }
// };
