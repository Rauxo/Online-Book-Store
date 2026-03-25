import React from 'react';
import { Link } from 'react-router-dom';
// import {  Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-white/10 pt-16 pb-8 px-4 mt-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="text-2xl font-black font-outfit tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">B</div>
            BOOK<span className="text-primary">HAVEN</span>
          </Link>
          <p className="text-slate-400 leading-relaxed max-w-xs">
            Your destination for the world's finest literature. Discover new authors, explore different genres, and grow your collection with BookHaven.
          </p>
          <div className="flex gap-4">
            {/* <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-primary hover:text-white transition-all"><FacebookIcon  size={20} /></a> */}
            {/* <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-primary hover:text-white transition-all"><Twitter size={20} /></a> */}
            {/* <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-primary hover:text-white transition-all"><Instagram size={20} /></a> */}
            {/* <a href="#" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-primary hover:text-white transition-all"><Linkedin size={20} /></a> */}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold font-outfit text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 font-medium">Home</Link></li>
            <li><Link to="/search" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 font-medium">Browse Books</Link></li>
            <li><Link to="/favourites" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 font-medium">Favourites</Link></li>
            <li><Link to="/profile" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 font-medium">My Orders</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold font-outfit text-white uppercase tracking-wider">Categories</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/search?category=Fiction" className="text-slate-400 hover:text-primary transition-colors font-medium">Fiction</Link></li>
            <li><Link to="/search?category=Non-Fiction" className="text-slate-400 hover:text-primary transition-colors font-medium">Non-Fiction</Link></li>
            <li><Link to="/search?category=Science" className="text-slate-400 hover:text-primary transition-colors font-medium">Science & Tech</Link></li>
            <li><Link to="/search?category=Business" className="text-slate-400 hover:text-primary transition-colors font-medium">Business</Link></li>
            <li><Link to="/search?category=Children" className="text-slate-400 hover:text-primary transition-colors font-medium">Children's Books</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold font-outfit text-white uppercase tracking-wider">Contact Us</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0" size={20} />
              <span className="text-slate-400 font-medium">123 Book Street, Literary Quadrant, Reading City, 560001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={20} />
              <span className="text-slate-400 font-medium">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={20} />
              <span className="text-slate-400 font-medium">support@bookhaven.com</span>
            </li>
          </ul>
          <div className="mt-2 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-primary font-bold">Subscribe to our Newsletter</p>
            <div className="mt-2 flex gap-2">
              <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-primary" />
              <button className="bg-primary text-white p-2 rounded-lg"><ExternalLink size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} BookHaven Bookstore. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium">Privacy Policy</a>
          <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium">Terms of Service</a>
          <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
