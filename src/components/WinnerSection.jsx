
import React from "react";

const winners = [
  {
    name: "Alex P.",
    contest: "Logo Design Challenge",
    prize: "$500",
    image: "https://randomuser.me/api/portraits/men/32.jpg", // reliable random man
  },
  {
    name: "Maria L.",
    contest: "Article Writing: Future of AI",
    prize: "$300",
    image: "https://randomuser.me/api/portraits/women/65.jpg", // random woman
  },
  {
    name: "David K.",
    contest: "Photography Contest: Nature Wonders",
    prize: "$400",
    image: "https://randomuser.me/api/portraits/men/85.jpg", // another man
  },
];
  

const WinnerSection = () => {
  return (
    <section className="bg-linear-to-r from-purple-500 to-pink-500 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Celebrate Our Recent Winners
        </h2>
        <p className="mb-12 text-lg md:text-xl opacity-90">
          Get inspired! See who’s winning, the prizes they earn, and start planning your next contest entry.
        </p>

        {/* Winner Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={winner.image}
                alt={winner.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold">{winner.name}</h3>
                <p className="text-sm mb-2 opacity-80">{winner.contest}</p>
                <p className="text-purple-600 font-semibold text-lg">{winner.prize}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Text */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            You could be next!
          </h3>
          <p className="max-w-2xl mx-auto opacity-90">
            Participate in contests, showcase your skills, and claim amazing prizes.
            Join thousands of creative minds on ContestHub today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WinnerSection;
