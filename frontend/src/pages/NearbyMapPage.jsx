import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import NearbyMapView from './marketplace/NearbyMapView';

export default function NearbyMapPage() {
  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="mb-6">
        <PageHeader
          icon="🗺️"
          title="Nearby Map Explorer"
          subtitle="Explore seed shops, markets, and farming resources mapped directly near your location."
        />
      </div>
      <NearbyMapView />
    </div>
  );
}
