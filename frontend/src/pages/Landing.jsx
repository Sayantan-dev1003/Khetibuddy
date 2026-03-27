import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustStrip from '../components/landing/TrustStrip';
import StatsSection from '../components/landing/StatsSection';
import VideoSection from '../components/landing/VideoSection';
import ArticlesGrid from '../components/landing/ArticlesGrid';
import FAQSection from '../components/landing/FAQSection';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';

function Landing() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <Hero />
      <TrustStrip />
      <StatsSection />
      <VideoSection />
      <ArticlesGrid />
      <FAQSection />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Landing;
