import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToFavs, removeFromFavs } from '../store/favouriteSlice';
import toast from 'react-hot-toast';

const BookCard = ({ book, isFav = false, isAdmin = false, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFromFavs(book._id));
      toast.success('Removed from favourites');
    } else {
      dispatch(addToFavs(book));
      toast.success('Added to favourites');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-4 rounded-2xl flex flex-col gap-4 group h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <Link to={`/book/${book._id}`}>
          <img 
            src={book.images && book.images.length > 0 
              ? (book.images[0].startsWith('http') ? book.images[0] : `http://localhost:5000${book.images[0]}`)
              : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'} 
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {user && (
          <button 
            onClick={toggleFav}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg backdrop-blur-md transition-all z-10 ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <Link to={`/book/${book._id}`} className="flex flex-col gap-1">
        <span className="text-xs text-primary font-bold uppercase tracking-wider">{book.category || 'General'}</span>
        <h3 className="text-lg font-bold font-outfit line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
        <p className="text-sm text-slate-400">by {book.author}</p>
      </Link>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xl font-bold text-white">₹{book.price}</span>
        {isAdmin ? (
          <div className="flex gap-2">
            <button onClick={() => onEdit(book)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">Edit</button>
            <button onClick={() => onDelete(book._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <Link to={`/book/${book._id}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-xl font-bold hover:bg-primary hover:text-white transition-all w-full">
              <ShoppingBag size={18} />
              <span>View Details</span>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
