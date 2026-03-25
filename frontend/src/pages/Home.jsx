import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { fetchFavourites } from '../store/favouriteSlice';
import BookCard from '../components/BookCard';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import { Zap } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { books, isLoading } = useSelector((state) => state.books);
  const { favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBooks());
    if (user) {
      dispatch(fetchFavourites());
    }
  }, [dispatch, user]);

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden glass rounded-[3rem] p-12 lg:p-20 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold w-fit">
              <Zap size={16} /> New Arrivals Available
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-outfit leading-tight">
              Unlock a World of <span className="gradient-text">Infinite</span> Stories
            </h1>
            <p className="text-lg text-slate-400 max-w-lg">
              Explore thousands of books from world-class authors. From thrilling mysteries to inspiring biographies, find your next adventure here.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Explore Collection
              </button>
              <button className="px-8 py-4 glass border-white/10 font-bold rounded-2xl hover:bg-white/5 transition-colors">
                How it Works
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800" 
              alt="Books" 
              className="relative w-[400px] h-[500px] object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </section>

        {/* Book Listing */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-outfit">Featured Books</h2>
            <div className="flex gap-2">
               {['All', 'Fiction', 'Tech', 'Life'].map(cat => (
                 <button key={cat} className="px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-primary hover:text-white transition-all">{cat}</button>
               ))}
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  isFav={favourites.some(f => f._id === book._id)} 
                />
              ))}
            </div>
          )}

          {!isLoading && books.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl">
              <p className="text-slate-400">No books found. Check back later!</p>
            </div>
          )}
        </section>
      </div>
    </AnimatedWrapper>
  );
};

export default Home;
