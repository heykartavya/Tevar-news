import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t-4 border-red-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-zinc-800 pb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-serif text-3xl font-black tracking-tight mb-4 text-white">
              TEVAR<span className="text-red-600">.</span>
            </h2>
            <p className="text-zinc-400 font-sans text-sm leading-relaxed mb-6">
              Delivering uncompromised journalism, breaking news, and in-depth analysis from around the globe since 2026.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-sm mb-4 text-zinc-200">Sections</h3>
            <ul className="space-y-3 font-sans text-sm text-zinc-400">
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('nav.national')}</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('nav.uttarpradesh')}</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('nav.bundelkhand')}</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('nav.education')}</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">{t('nav.crime')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-sm mb-4 text-zinc-200">{t('about.title')}</h3>
            <ul className="space-y-3 font-sans text-sm text-zinc-400">
              <li><Link to="/about/about-us" className="hover:text-white transition-colors">{t('about.aboutUs')}</Link></li>
              <li><Link to="/about/contact-us" className="hover:text-white transition-colors">{t('about.contactUs')}</Link></li>
              <li><Link to="/about/advertise" className="hover:text-white transition-colors">{t('about.advertise')}</Link></li>
              <li><Link to="/about/privacy-policy" className="hover:text-white transition-colors">{t('about.privacyPolicy')}</Link></li>
              <li><Link to="/about/grievance" className="hover:text-white transition-colors">{t('about.grievance')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-bold uppercase tracking-wider text-sm mb-4 text-zinc-200">Stay Informed</h3>
            <p className="text-zinc-400 font-sans text-sm mb-4">Get our daily briefing delivered to your inbox.</p>
            <form className="flex flex-col space-y-2">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-10 py-2.5 text-sm font-sans focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-white"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-sans font-bold text-sm py-2.5 rounded hover:bg-zinc-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-zinc-500 font-sans text-xs">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Tevar News Media. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Ad Choices</a>
            <a href="#" className="hover:text-zinc-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
