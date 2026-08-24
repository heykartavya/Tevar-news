import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { ArticlePage } from './pages/ArticlePage';
import { AboutLayout } from './pages/about/AboutLayout';
import { AboutUs } from './pages/about/AboutUs';
import { ContactUs } from './pages/about/ContactUs';
import { EditorialPolicy } from './pages/about/EditorialPolicy';
import { CorrectionPolicy } from './pages/about/CorrectionPolicy';
import { PrivacyPolicy } from './pages/about/PrivacyPolicy';
import { Terms } from './pages/about/Terms';
import { Disclaimer } from './pages/about/Disclaimer';
import { Grievance } from './pages/about/Grievance';
import { Advertise } from './pages/about/Advertise';
import { LanguageProvider } from './lib/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<AboutLayout />}>
            <Route index element={<Navigate to="about-us" replace />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="editorial-policy" element={<EditorialPolicy />} />
            <Route path="correction-policy" element={<CorrectionPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="advertise" element={<Advertise />} />
            <Route path="grievance" element={<Grievance />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
