import React from "react";

const StaticCTA = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      {/* Section 6: Newsletter / CTA */}
      <div className="py-20 px-4 text-center">
        {/* CHANGED: Changed max-w-5xl to max-w-7xl to match Navbar/Footer alignment */}
        <div
          className="max-w-7xl mx-auto p-6 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-base-content/10 shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--background-nav), var(--text-nav) 3%)",
          }}
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none hidden md:block"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 italic tracking-tighter uppercase">
              Stay Updated with{" "}
              <span className="text-primary">ContestHub!</span>
            </h2>
            <p className="mb-10 max-w-2xl mx-auto opacity-70 text-base md:text-lg leading-relaxed">
              Subscribe to our newsletter and never miss a contest, winner
              announcement, or creative challenge.
            </p>

            <form
              className="flex flex-col sm:flex-row justify-center gap-2 max-w-lg mx-auto bg-base-100 p-2 rounded-2xl border border-base-content/10 shadow-inner"
              style={{ backgroundColor: "var(--background-nav)" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-ghost w-full focus:outline-none focus:bg-transparent text-lg h-14"
              />
              <button
                type="submit"
                className="btn btn-primary h-14 px-6 sm:px-10 rounded-xl font-black uppercase tracking-widest"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section 7: Stats / Achievements */}
      <div
        className="py-16 px-4 text-center border-y border-base-content/5"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--background-nav), var(--text-nav) 7%)",
        }}
      >
        {/* Already max-w-7xl, so this stays aligned */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-12 opacity-40">
            Our Global Impact
          </h3>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-24">
            <div className="group text-center">
              <span className="text-5xl md:text-7xl font-black text-primary italic transition-all group-hover:scale-110 block">
                150+
              </span>
              <p className="mt-3 font-bold uppercase text-[10px] md:text-xs tracking-widest opacity-60">
                Contests Hosted
              </p>
            </div>
            <div className="group text-center">
              <span className="text-5xl md:text-7xl font-black text-primary italic transition-all group-hover:scale-110 block">
                5K+
              </span>
              <p className="mt-3 font-bold uppercase text-[10px] md:text-xs tracking-widest opacity-60">
                Participants
              </p>
            </div>
            <div className="group text-center">
              <span className="text-5xl md:text-7xl font-black text-primary italic transition-all group-hover:scale-110 block">
                100+
              </span>
              <p className="mt-3 font-bold uppercase text-[10px] md:text-xs tracking-widest opacity-60">
                Winners
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticCTA;
