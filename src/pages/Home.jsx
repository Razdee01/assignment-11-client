import React from "react";
import HeroBanner from "../components/HeroBanner";
import WinnerSection from "../components/WinnerSection";
import StaticCTA from "../components/StaticCTA";
import PopularContests from "../components/PopularContests";
import PopularCategories from "../components/PopularCategories";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";

const Home = () => {
  return (
    <div data-aos="fade-up" className="space-y-0 w-full overflow-x-hidden">
      <HeroBanner />
      <PopularContests />
      <WinnerSection />
      <StaticCTA />
      <PopularCategories />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};

export default Home;
