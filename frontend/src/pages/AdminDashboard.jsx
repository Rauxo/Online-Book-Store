import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, addBook, updateBook, deleteBook } from '../store/bookSlice';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import BookCard from '../components/BookCard';
import { Plus, X, List, Image as ImageIcon, DollarSign, User as UserIcon, Type } from 'lucide-react';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', category: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const dispatch = useDispatch();
  const { books, isLoading } = useSelector(state => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 4) {
      alert('Maximum 4 images allowed');
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
      alert('Please select at least one image');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    if (editingBook) {
      await dispatch(updateBook({ id: editingBook._id, bookData: data }));
    } else {
      await dispatch(addBook(data));
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
      // For editing, we might want to show existing images, but for now just clear
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 glass p-8 rounded-[2.5rem]">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold font-outfit">Admin <span className="text-primary">Dashboard</span></h1>
            <p className="text-slate-400">Manage your bookstore inventory and orders</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-primary/20"
          >
            <Plus size={20} /> Add New Book
          </button>
        </header>

        <section>
          <div className="flex items-center gap-2 mb-8 text-slate-300 font-bold uppercase tracking-widest text-sm">
            <List size={18} /> Current Inventory
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  isAdmin={true} 
                  onEdit={openModal} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Modal Overlay */}
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
                  <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-1"><DollarSign size={14} /> Price</label>
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
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
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
