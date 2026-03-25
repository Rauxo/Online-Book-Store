import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Book, Heart, User, LogOut, LayoutDashboard, Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Book className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-outfit gradient-text">
            BookHaven
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/search" className="flex items-center gap-1 hover:text-primary transition-colors">
            <SearchIcon size={18} /> Search
          </Link>
          {user && (
            <>
              <Link to="/favourites" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Heart size={18} /> Favourites
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
                <User size={20} />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="px-5 py-2 bg-primary hover:bg-primary/90 rounded-full font-medium transition-colors shadow-lg shadow-primary/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
