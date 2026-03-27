import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustStrip from '../components/landing/TrustStrip';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import FAQSection from '../components/landing/FAQSection';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
           <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ModulesShowcase />
      <Testimonials />
      <TrustStrip />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;