import React, { useState } from 'react';
import HeroSection from '../../components/Support/HeroSection';
import SupportGrid from '../../components/Support/SupportGrid';
import FAQSection from '../../components/Support/FAQSection';
import './SupportPage.css'
const SupportPage: React.FC = () => {
  return (
    <div className="support-page">
      <HeroSection />
      <main className="container">
        <SupportGrid />
        <FAQSection />
      </main>
    </div>
  );
};

export default SupportPage;