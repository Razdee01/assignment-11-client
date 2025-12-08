import React from 'react';
import HeroBanner from '../components/HeroBanner';
import WinnerSection from '../components/WinnerSection';
import StaticCTA from '../components/StaticCTA';

const Home = () => {
    return (
      <div>
        <HeroBanner></HeroBanner>
        <div className="mt-8 mb-8">
          <WinnerSection />
        </div>
        <StaticCTA />
      </div>
    );
};

export default Home;