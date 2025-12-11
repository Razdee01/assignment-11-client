import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router';

import Footer from '../components/Footer';



const Rootlayout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />

    
        <main className="grow flex items-center justify-center bg-gray-100">
          <Outlet /> 
        </main>

        <Footer />
      </div>
    );
};

export default Rootlayout;