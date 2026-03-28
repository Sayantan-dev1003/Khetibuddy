import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import NearbyMapView from './marketplace/NearbyMapView';

export default function NearbyMapPage() {
  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <PageHeader
            icon="🗺️"
            title="Interactive Map View"
            subtitle="Visualize farming clusters, market locations, and supply chain logistics in real-time."
            variant="cinematic"
            className="text-left"
          />
        </motion.div>
        
        <NearbyMapView />
      </div>
    </div>
  );
}
