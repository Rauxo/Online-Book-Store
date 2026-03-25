import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkout } from '../store/orderSlice';
import { useNavigate } from 'react-router-dom';
import AnimatedWrapper from '../components/AnimatedWrapper';
import { MapPin, CreditCard, ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [address, setAddress] = useState({ street: '', city: '', zipCode: '', country: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.orders);
  
  // For demo: Mocking a single item in cart or using a simple one-click buy
  const demoItem = { book: 'Sample Book ID', quantity: 1, price: 29.99 }; 

  const handleCheckout = async (e) => {
    e.preventDefault();
    // In a real app, items would come from a cart slice
    const orderData = {
      items: [{ book: '65f1234567890abcdef12345', quantity: 1 }], // Placeholder ID
      address,
      totalPrice: 29.99
    };
    
    const result = await dispatch(checkout(orderData));
    if (!result.error) {
      toast.success('Order placed successfully!');
      setIsSuccess(true);
      setTimeout(() => navigate('/profile'), 3000);
    } else {
      toast.error(result.payload || 'Failed to place order');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 mb-6">
          <CheckCircle size={80} />
        </motion.div>
        <h2 className="text-4xl font-bold font-outfit mb-4 text-white">Order Confirmed!</h2>
        <p className="text-slate-400 max-w-md">Thank you for your purchase. Your books are on their way. Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <AnimatedWrapper>
      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        <div className="flex-1 flex flex-col gap-8">
          <h1 className="text-4xl font-bold font-outfit">Checkout</h1>
          
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-primary" /> Shipping Address
            </h3>
            <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Street Address</label>
                <input 
                  type="text" 
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">City</label>
                <input 
                  type="text" 
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="New York"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">ZIP Code</label>
                <input 
                  type="text" 
                  value={address.zipCode}
                  onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="10001"
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Country</label>
                <input 
                  type="text" 
                  value={address.country}
                  onChange={(e) => setAddress({...address, country: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="United States"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="text-primary" /> Payment Method
                </h3>
                <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                  <span className="font-bold">Cash on Delivery</span>
                  <div className="w-6 h-6 rounded-full border-4 border-primary bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="col-span-1 md:col-span-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Confirm & Pay Now"}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="glass p-8 rounded-3xl sticky top-32">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart className="text-primary" /> Order Summary
            </h3>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Selected Book</span>
                <span className="font-bold">$29.99</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Quantity: 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Shipping</span>
                <span className="text-green-500 font-bold uppercase text-xs">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total</span>
              <span className="gradient-text">$29.99</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Checkout;
