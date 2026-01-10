import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "../utilitis/axiosConfig";
import Loading from "../loading/Loading";

const PopularContests = () => {
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: async () => {
      const res = await axios.get(
        "https://assignment-11-server-five-flax.vercel.app/popular-contests"
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    /* We use style variables to ensure it matches your Navbar's background exactly */
    <section
      className="py-20 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter">
              🔥 POPULAR <span className="text-primary">CONTESTS</span>
            </h2>
            <p className="opacity-70 mt-2">
              Join the most trending challenges right now.
            </p>
          </div>
          <Link to="/all-contests">
            <button className="btn btn-primary btn-outline rounded-full px-6 sm:px-8 hover:scale-105 transition-all">
              Show All Contests
            </button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="group relative border border-base-content/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
              style={{ backgroundColor: "var(--background-nav)" }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={contest.bannerImage}
                  alt={contest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <div className="badge badge-primary font-bold p-3 shadow-lg uppercase text-[10px]">
                    Popular
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-7 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors truncate">
                  {contest.name}
                </h3>
                <p className="opacity-70 mt-3 line-clamp-2 text-sm leading-relaxed flex-grow">
                  {contest.description}
                </p>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-black opacity-40">
                      Participants
                    </span>
                    <span className="font-bold text-lg">
                      {contest.participants ?? 0}{" "}
                      <span className="text-xs font-normal opacity-60">
                        Joined
                      </span>
                    </span>
                  </div>

                  <Link
                    to={`/contests/${contest._id}`}
                    className="btn btn-primary rounded-xl px-4 sm:px-6"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularContests;
