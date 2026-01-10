import { Link } from "react-router";

const FinalCTA = () => {
  return (
    <section className="py-10 px-4 md:px-6">
      <div
        className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[4rem] py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 text-center relative overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, var(--primary-color), #4f46e5)",
          color: "white",
        }}
      >
        {/* Background Decoration */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none hidden md:block"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-tight">
            Ready to become a <span className="text-yellow-400">Champion?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-xl opacity-90 mb-10 leading-relaxed font-medium">
            Join 5,000+ creators and start competing for prizes. Register today,
            find your favorite contest, and join the race!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Keeping only Browse Contests as requested */}
            <Link to="/all-contests" className="w-full sm:w-auto">
              <button className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary rounded-full px-8 sm:px-12 font-black uppercase tracking-widest w-full sm:w-auto transition-all duration-300 shadow-lg">
                Browse Contests
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
