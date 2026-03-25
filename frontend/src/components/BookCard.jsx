import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavs, removeFromFavs } from '../store/favouriteSlice';

const BookCard = ({ book, isFav = false, isAdmin = false, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const toggleFav = () => {
    if (isFav) {
      dispatch(removeFromFavs(book._id));
    } else {
      dispatch(addToFavs(book._id));
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-4 rounded-2xl flex flex-col gap-4 group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <img 
          src={book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isAdmin && user && (
            <button 
              onClick={toggleFav}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${isFav ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'}`}
            >
              <Heart size={18} fill={isFav ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-primary font-bold uppercase tracking-wider">{book.category || 'General'}</span>
        <h3 className="text-lg font-bold font-outfit line-clamp-1">{book.title}</h3>
        <p className="text-sm text-slate-400">by {book.author}</p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xl font-bold text-white">${book.price}</span>
        {isAdmin ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit(book)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">Edit</button>
            <button onClick={() => onDelete(book._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
          </div>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
            <ShoppingBag size={18} />
            <span>Buy</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
