import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import BookCard from '../components/BookCard';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const { books, isLoading } = useSelector((state) => state.books);
  const { favourites } = useSelector((state) => state.favourites);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchBooks(keyword));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, dispatch]);

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold font-outfit">Find Your Next <span className="gradient-text">Great Read</span></h1>
          <p className="text-slate-400">Search through our collection of books by title, author, or category.</p>
          
          <div className="relative w-full mt-4">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
            <input 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full h-16 glass pl-16 pr-12 rounded-2xl text-lg focus:ring-2 focus:ring-primary outline-none transition-all shadow-xl shadow-primary/5"
            />
            {keyword && (
              <button 
                onClick={() => setKeyword('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard 
                      key={book._id} 
                      book={book} 
                      isFav={favourites.some(f => f._id === book._id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl">
                  <p className="text-slate-400">No books found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default Search;
