// components/StaticCTA.jsx
import React from "react";

const StaticCTA = () => {
  return (
    <div className="bg-purple-600 text-white">
      {/* Newsletter / CTA */}
      <div className="py-10 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated with ContestHub!
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and never miss a contest, winner
          announcement, or creative challenge.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full sm:w-auto flex-1"
          />
          <button type="submit" className="btn btn-white text-purple-600">
            Subscribe
          </button>
        </form>
      </div>

      {/* Stats / Achievements */}
      <div className="bg-purple-700 py-8 px-4 text-center">
        <h3 className="text-2xl font-bold mb-6">Our Achievements</h3>
        <div className="flex flex-wrap justify-center gap-8 text-white">
          <div>
            <span className="text-4xl font-bold">150+</span>
            <p className="mt-1">Contests Hosted</p>
          </div>
          <div>
            <span className="text-4xl font-bold">5K+</span>
            <p className="mt-1">Participants</p>
          </div>
          <div>
            <span className="text-4xl font-bold">100+</span>
            <p className="mt-1">Winners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticCTA;
