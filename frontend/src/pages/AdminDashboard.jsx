import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, addBook, updateBook, deleteBook } from '../store/bookSlice';
import { fetchAllOrders } from '../store/orderSlice';
import API from '../services/api';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import BookCard from '../components/BookCard';
import { Plus, X, List, Image as ImageIcon, IndianRupee, User as UserIcon, Type, ShoppingCart, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', category: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalOrders: 0 });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const dispatch = useDispatch();
  const { books, isLoading: loadingBooks } = useSelector(state => state.books);
  const { orders, isLoading: loadingOrders } = useSelector(state => state.orders);

  useEffect(() => {
    if (activeTab === 'inventory') {
      dispatch(fetchBooks());
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      dispatch(fetchAllOrders());
    }
    fetchStats();
  }, [dispatch, activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await API.get('/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await API.get('/orders/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      dispatch(fetchAllOrders());
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !editingBook) {
      toast.error('Please select at least one image');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    selectedFiles.forEach(file => data.append('images', file));

    if (editingBook) {
      const res = await dispatch(updateBook({ id: editingBook._id, bookData: data }));
      if (!res.error) toast.success('Book updated successfully!');
      else toast.error(res.payload || 'Failed to update book');
    } else {
      const res = await dispatch(addBook(data));
      if (!res.error) toast.success('Book added to collection!');
      else toast.error(res.payload || 'Failed to add book');
    }
    closeModal();
    dispatch(fetchBooks());
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({ 
        title: book.title, 
        author: book.author, 
        price: book.price, 
        category: book.category || '', 
        description: book.description || '' 
      });
      setPreviews(book.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`));
      setSelectedFiles([]); 
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', price: '', category: '', description: '' });
      setSelectedFiles([]);
      setPreviews([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', author: '', price: '', category: '', description: '' });
    setSelectedFiles([]);
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const res = await dispatch(deleteBook(id));
      if (!res.error) toast.success('Book deleted successfully');
      else toast.error(res.payload || 'Failed to delete book');
    }
  };

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-8">
        {/* Header & Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <header className="lg:col-span-1 flex flex-col justify-between glass p-8 rounded-[2.5rem]">
            <div>
              <h1 className="text-4xl font-bold font-outfit">Admin <span className="text-primary">Panel</span></h1>
              <p className="text-slate-400 mt-2">Manage your bookstore ecosystem</p>
            </div>
            <button 
              onClick={() => openModal()}
              className="mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-primary/20"
            >
              <Plus size={20} /> Add New Book
            </button>
          </header>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2.5rem] flex items-center gap-6">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Income</p>
                <h3 className="text-3xl font-bold text-white">₹{stats.totalIncome.toLocaleString()}</h3>
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] flex items-center gap-6">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                <ShoppingCart size={32} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Bookings</p>
                <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex gap-4 p-2 bg-slate-900/50 rounded-2xl w-fit">
          {[
            { id: 'inventory', label: 'Inventory', icon: List },
            { id: 'orders', label: 'Bookings', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <main className="min-h-[400px]">
          {activeTab === 'inventory' && (
            <section>
              {loadingBooks ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book._id} book={book} isAdmin={true} onEdit={openModal} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'users' && (
            <section className="glass rounded-[2rem] overflow-hidden">
              {loadingUsers ? <LoadingSpinner /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 uppercase text-xs font-bold tracking-widest">
                      <tr>
                        <th className="px-8 py-6">Name</th>
                        <th className="px-8 py-6">Email</th>
                        <th className="px-8 py-6">Role</th>
                        <th className="px-8 py-6">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(user => (
                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6 font-bold">{user.name}</td>
                          <td className="px-8 py-6 text-slate-400">{user.email}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-500'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="flex flex-col gap-4">
              {loadingOrders ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map(order => (
                    <div key={order._id} className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex gap-4 items-center">
                        <div className="p-3 bg-white/5 rounded-xl">
                          <ShoppingCart size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-bold">Booking #{order._id.slice(-6)}</p>
                          <p className="text-slate-400 text-sm">{order.user?.name || 'Unknown User'} • {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-slate-500 text-xs mt-1">{order.phone} • {order.address.street}, {order.address.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">
                            {item.book?.title} (x{item.quantity})
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Total</p>
                          <p className="text-xl font-bold text-white">₹{order.totalPrice}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border-none outline-none cursor-pointer ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 
                              order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                            }`}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

        {/* Modal Overlay (Add/Edit Book) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass w-full max-w-2xl rounded-[3rem] p-10 overflow-y-auto max-h-[90vh] relative shadow-2xl border-white/20">
              <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-bold font-outfit mb-8">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><Type size={14} /> Title</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><UserIcon size={14} /> Author</label>
                  <input required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><IndianRupee size={14} /> Price</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><Plus size={14} /> Category</label>
                  <input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><ImageIcon size={14} /> Book Images (Min 1, Max 4)</label>
                  <div className="flex flex-wrap gap-4 mb-2">
                    {previews.map((url, index) => (
                      <div key={index} className="relative w-24 h-32 rounded-lg overflow-hidden border border-white/10">
                        <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {previews.length < 4 && (
                      <label className="w-24 h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Plus size={24} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500 mt-1">Upload</span>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>
                <button type="submit" className="col-span-1 md:col-span-2 mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all">
                  {editingBook ? 'Update Book' : 'Add to Collection'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default AdminDashboard;
