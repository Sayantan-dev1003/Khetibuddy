import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import GovSchemes from '../components/landing/GovSchemes';
import TrustStrip from '../components/landing/TrustStrip';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import ModulesShowcase from '../components/landing/ModulesShowcase';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <GovSchemes />
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
