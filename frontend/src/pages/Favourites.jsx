import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavourites } from '../store/favouriteSlice';
import BookCard from '../components/BookCard';
import AnimatedWrapper from '../components/AnimatedWrapper';
import LoadingSpinner from '../components/LoadingSpinner';
import { HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favourites = () => {
  const dispatch = useDispatch();
  const { favourites, isLoading } = useSelector((state) => state.favourites);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  return (
    <AnimatedWrapper>
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold font-outfit">Your <span className="text-red-500">Favourites</span></h1>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {favourites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favourites.map((book) => (
                  <BookCard 
                    key={book._id} 
                    book={book} 
                    isFav={true} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-[3rem] text-center px-4">
                <div className="bg-red-500/10 p-6 rounded-full text-red-500 mb-6">
                  <HeartOff size={48} />
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-2">No Favourites Yet</h3>
                <p className="text-slate-400 max-w-sm mb-8">You haven't added any books to your favourites. Start exploring our collection!</p>
                <Link to="/" className="px-8 py-3 bg-primary text-white font-bold rounded-2xl">Browse Books</Link>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default Favourites;
