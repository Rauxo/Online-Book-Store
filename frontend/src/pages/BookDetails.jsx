import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load book details');
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a book');
      navigate('/login');
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const { data: order } = await axios.post(
        'http://localhost:5000/api/orders/razorpay',
        { amount: book.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_test_your_key_here', // Replace with your key
        amount: order.amount,
        currency: order.currency,
        name: 'Online Book Store',
        description: `Booking: ${book.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment on backend
            const verifyRes = await axios.post(
              'http://localhost:5000/api/orders/verify',
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              // 3. Create actual order in DB
              await axios.post(
                'http://localhost:5000/api/orders',
                {
                  items: [{ book: id, quantity: 1 }],
                  address: { street: 'Main St', city: 'City', zipCode: '12345', country: 'Country' }, // Default for now, should come from a form
                  totalPrice: book.price,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast.success('Book booked successfully!');
              navigate('/profile');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Error initiating payment');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl shadow-2xl mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {book.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000${img}`}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg border border-slate-700"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
            <p className="text-xl text-primary font-semibold mb-4">by {book.author}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-green-400">₹{book.price}</span>
              <span className="px-3 py-1 bg-slate-800 text-xs rounded-full text-slate-400">{book.category}</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-8">{book.description}</p>
          </div>
          <button
            onClick={handlePayment}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            Book Now / Integrate Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
