import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import StaticCTA from '../components/StaticCTA';
import WinnerSection from '../components/WinnerSection';

const Rootlayout = () => {
    return (
      <div>
        <NavBar />
        <HeroBanner></HeroBanner>
        <Outlet />
        <div className='mt-8 mb-8'>
          <WinnerSection />
        </div>
        <StaticCTA />
        <Footer />
      </div>
    );
};

export default Rootlayout;