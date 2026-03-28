import React from 'react';
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
        <NearbyMapView />
      </div>
    </div>
  );
}
