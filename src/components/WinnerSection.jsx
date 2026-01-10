import React from "react";

const winners = [
  {
    name: "Alex P.",
    contest: "Logo Design Challenge",
    prize: "$500",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Maria L.",
    contest: "Article Writing: Future of AI",
    prize: "$300",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "David K.",
    contest: "Photography Contest: Nature Wonders",
    prize: "$400",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
];

const WinnerSection = () => {
  return (
    <section
      className="py-20 px-4 transition-colors duration-300 relative overflow-hidden" // Added overflow-hidden and relative
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center relative z-20">
        {" "}
        // Added z-index layer
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-black mb-4 italic uppercase tracking-tighter">
          Celebrate Our <span className="text-primary">Recent Winners</span>
        </h2>
        <p className="mb-12 text-lg opacity-70 max-w-2xl mx-auto">
          Get inspired! See who's winning, the prizes they earn, and start
          planning your next victory.
        </p>
        {/* Winner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="group relative border border-base-content/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
              style={{ backgroundColor: "var(--background-nav)" }}
            >
              {/* Image with Trophy Badge */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={winner.image}
                  alt={winner.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary text-white p-2 rounded-full shadow-lg">
                  🏆
                </div>
              </div>

              {/* Card Text Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1">{winner.name}</h3>
                <p className="text-sm opacity-60 mb-4">{winner.contest}</p>
                <div className="inline-block bg-primary/10 text-primary font-black px-6 py-2 rounded-full border border-primary/20">
                  WINNER: {winner.prize}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Motivational Footer */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none hidden md:block"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none hidden md:block"></div>
        <div className="relative z-10 mt-16">
          {" "}
          // Added margin-top for spacing
          <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase italic tracking-tighter">
            You could be <span className="text-primary">next!</span>
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-lg font-medium leading-relaxed opacity-90">
            Participate in contests, showcase your skills, and claim amazing
            prizes. Join thousands of creative minds on{" "}
            <span className="font-bold border-b-2 border-primary">
              ContestHub
            </span>{" "}
            today.
          </p>
          <button className="btn btn-primary px-8 sm:px-12 h-14 rounded-full font-bold uppercase tracking-widest shadow-xl shadow-primary/40 hover:scale-105 transition-transform">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default WinnerSection;
