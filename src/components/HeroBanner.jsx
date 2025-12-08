import { useNavigate } from "react-router";

export default function HeroBanner() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query) return;
    navigate(`/all-contests?search=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://contesthub-resources.s3.amazonaws.com/contesthub-main-banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content text-center text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
              ContestHub
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Join the best creative contests – Design, Writing, Gaming & More!
          </p>

          {/* Search Bar */}
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value.trim();
              handleSearch(query);
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search contests... (e.g. Logo Design, Article Writing)"
              className="input input-bordered input-lg w-full bg-white/95 text-black"
            />
            <button type="submit" className="btn btn-primary btn-lg">
              Search Contests
            </button>
          </form>

          {/* Quick Tags (Non-clickable) */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {[
              "Logo Design",
              "Article Writing",
              "Photography",
              "Gaming",
              "Business Idea",
            ].map((tag) => (
              <span
                key={tag}
                className="btn btn-outline btn-md text-white cursor-default opacity-70 hover:opacity-70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
