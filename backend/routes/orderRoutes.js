const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Razorpay Routes
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
