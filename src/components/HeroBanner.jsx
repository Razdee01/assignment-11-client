import { useNavigate } from "react-router";

export default function HeroBanner() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query) return;
    navigate(`/all-contests?search=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className="hero h-[60vh] sm:h-[65vh] md:h-[70vh] relative overflow-hidden transition-all duration-300"
      style={{
        /* FIX: Use var(--hero-overlay) so it flips from dark to light with your toggle */
        backgroundImage: `linear-gradient(var(--hero-overlay), var(--hero-overlay)), url('https://contesthub-resources.s3.amazonaws.com/contesthub-main-banner.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none hidden md:block"></div>

      {/* FIX: Aligned container to match Navbar width */}
      <div className="hero-content text-center w-full max-w-7xl px-4">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight"
            style={{ color: "var(--text-nav)" }}
          >
            Welcome to <span className="text-primary">ContestHub</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90"
            style={{ color: "var(--text-nav)" }}
          >
            Join the best creative contests – Design, Writing, Gaming & More!
            Showcase your skill and win big.
          </p>

          {/* Search Bar - Responsive Fix */}
          <form
            className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-2xl mx-auto bg-base-100/20 backdrop-blur-xl p-2 rounded-2xl border border-base-content/10 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value.trim();
              handleSearch(query || "All");
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search contests..."
              className="input input-ghost w-full focus:outline-none focus:bg-transparent text-base sm:text-lg h-12 sm:h-14"
              style={{ color: "var(--text-nav)" }}
            />
            <button
              type="submit"
              className="btn btn-primary h-12 sm:h-14 px-6 sm:px-10 rounded-xl font-bold uppercase"
            >
              Search
            </button>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-10">
            <span
              className="w-full text-sm font-semibold mb-2 opacity-50"
              style={{ color: "var(--text-nav)" }}
            >
              Popular:
            </span>
            {["Logo Design", "Article Writing", "Photography", "Gaming"].map(
              (tag) => (
                <button
                  key={tag}
                  className="btn btn-sm btn-outline rounded-full px-3 sm:px-5 text-sm"
                  style={{
                    color: "var(--text-nav)",
                    borderColor:
                      "color-mix(in srgb, var(--text-nav), transparent 50%)",
                  }}
                  onClick={() => handleSearch(tag)}
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
