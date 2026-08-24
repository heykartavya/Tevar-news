import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLanguage } from '../../lib/LanguageContext';

export const AboutLayout: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { path: '/about/about-us', label: t('about.aboutUs') },
    { path: '/about/contact-us', label: t('about.contactUs') },
    { path: '/about/editorial-policy', label: t('about.editorialPolicy') },
    { path: '/about/correction-policy', label: t('about.correctionPolicy') },
    { path: '/about/privacy-policy', label: t('about.privacyPolicy') },
    { path: '/about/terms', label: t('about.terms') },
    { path: '/about/disclaimer', label: t('about.disclaimer') },
    { path: '/about/grievance', label: t('about.grievance') },
    { path: '/about/advertise', label: t('about.advertise') }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 pr-6">
            <h1 className="font-serif text-3xl font-bold tracking-tight mb-8">{t('about.title')}</h1>
            <nav className="flex flex-col space-y-2">
              {links.map((link) => {
                const isActive = location.pathname.includes(link.path);
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className={`px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
