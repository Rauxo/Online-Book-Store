import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/orderSlice';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Package, Calendar, MapPin, ExternalLink } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { myOrders, isLoading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        {/* User Card */}
        <div className="glass p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <User size={64} className="text-white" />
          </div>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-primary w-fit mx-auto md:mx-0">
              {user.role} Account
            </div>
            <h1 className="text-4xl font-bold font-outfit">{user.name}</h1>
            <p className="text-slate-400 text-lg">{user.email}</p>
          </div>
        </div>

        {/* Order History */}
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold font-outfit flex items-center gap-3">
            <Package className="text-primary" /> Order History
          </h2>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col gap-6">
              {myOrders.length > 0 ? (
                myOrders.map((order) => (
                  <div key={order._id} className="glass p-8 rounded-3xl group border-transparent hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <span className="font-medium text-slate-300">Order ID: #{order._id.slice(-8)}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex items-center gap-3">
                               <div className="w-12 h-16 bg-white/5 rounded-lg overflow-hidden shrink-0">
                                 <img src={item.book.image} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div>
                                 <p className="font-bold text-white leading-tight">{item.book.title}</p>
                                 <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                        <div className="flex flex-col md:items-end gap-1">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Amount</span>
                          <span className="text-2xl font-bold text-white">${order.totalPrice}</span>
                        </div>
                        <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl">
                  <p className="text-slate-400">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </AnimatedWrapper>
  );
};

export default Profile;
