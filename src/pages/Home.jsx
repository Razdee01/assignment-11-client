import React from 'react';
import HeroBanner from '../components/HeroBanner';
import WinnerSection from '../components/WinnerSection';
import StaticCTA from '../components/StaticCTA';
import PopularContests from '../components/PopularContests';

const Home = () => {
    return (
      <div data-aos="fade-up">
        <HeroBanner></HeroBanner>
        <PopularContests></PopularContests>
        <div className="mt-8 mb-8">
          <WinnerSection />
        </div>
        <StaticCTA />
      </div>
    );
};

export default Home;