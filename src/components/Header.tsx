import React, { useState, useEffect } from 'react';
import { Search, Menu, User, Bell, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category, SiteLanguage } from '../types';
import { CATEGORIES } from '../data';
import { useLanguage } from '../lib/LanguageContext';

interface HeaderProps {
  activeCategory?: string;
  onCategoryChange?: (category: Category) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full bg-white relative z-50">
      {/* Top Bar - Date and Utility Links */}
      <div className="hidden md:flex justify-between items-center px-6 py-1 border-b border-gray-100 text-xs font-sans text-gray-500 uppercase tracking-wider">
        <span>{new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-black transition-colors">Newsletters</a>
          <a href="#" className="hover:text-black transition-colors">Podcasts</a>
          <a href="#" className="hover:text-black transition-colors text-red-600 font-semibold">Subscribe</a>
          <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
            <Globe size={14} />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as SiteLanguage)}
              className="bg-transparent border-none focus:outline-none cursor-pointer uppercase text-xs"
            >
              <option value="en">EN</option>
              <option value="hinglish">Hinglish</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className={`px-4 md:px-6 transition-all duration-300 ${isScrolled ? 'py-3 sticky top-0 shadow-sm bg-white' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Actions */}
          <div className="flex items-center space-x-4 flex-1 md:flex-none md:w-1/3">
            <button 
              className="md:hidden text-gray-900"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center relative group">
              <Search size={20} className="text-gray-500 absolute left-3 pointer-events-none" />
              <input 
                type="text"
                placeholder={t('home.search')}
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                disabled={!onSearchChange}
                className="pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm font-sans focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all w-32 focus:w-64 placeholder-gray-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="flex-none flex justify-center md:w-1/3">
            <Link to="/" className="font-serif text-3xl md:text-5xl font-black tracking-tight text-gray-900 cursor-pointer">
              TEVAR<span className="text-red-700">.</span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex justify-end items-center space-x-2 sm:space-x-4 flex-1 md:flex-none md:w-1/3">
            <button className="text-gray-700 hover:text-black hidden sm:block">
              <Bell size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
              <User size={20} />
              <span className="font-sans text-sm font-medium hidden lg:block">Sign In</span>
            </button>
            {/* Mobile language toggle */}
            <div className="md:hidden flex items-center">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as SiteLanguage)}
                className="bg-transparent border-none focus:outline-none cursor-pointer uppercase text-xs font-bold text-gray-600"
              >
                <option value="en">EN</option>
                <option value="hinglish">Hing</option>
                <option value="hi">HI</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      {onCategoryChange && (
        <nav className="border-y border-gray-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex justify-center space-x-8 lg:space-x-12 py-3 overflow-x-auto hide-scrollbar">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => onCategoryChange(category as Category)}
                    className={`font-sans text-sm tracking-wide transition-colors whitespace-nowrap ${
                      activeCategory === category 
                        ? 'font-bold text-black border-b-2 border-black pb-1' 
                        : 'text-gray-600 hover:text-black font-medium'
                    }`}
                  >
                    {t(`nav.${category.toLowerCase().replace(/\s+/g, '')}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-serif text-2xl font-black">TEVAR<span className="text-red-700">.</span></h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 pb-4 border-b border-gray-100">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder={t('home.search')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>
              <ul className="flex flex-col py-2">
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        onCategoryChange(category as Category);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 font-sans text-base ${
                        activeCategory === category 
                          ? 'font-bold text-red-700 bg-red-50' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t(`nav.${category.toLowerCase().replace(/\s+/g, '')}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
