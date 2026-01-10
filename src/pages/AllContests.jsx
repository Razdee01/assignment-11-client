import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import axios from "../utilitis/axiosConfig";

const AllContests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const searchQueryFromUrl =
    new URLSearchParams(location.search).get("search") || "All";

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["all-contests", searchQueryFromUrl],
    queryFn: async () => {
      const res = await axios.get(
        `https://assignment-11-server-five-flax.vercel.app/all-contests?search=${encodeURIComponent(
          searchQueryFromUrl
        )}`
      );
      return res.data;
    },
  });

  const contestTypes = ["All", ...new Set(contests.map((c) => c.contentType))];
  const [activeTab, setActiveTab] = useState("All");

  const filteredContests =
    activeTab === "All"
      ? contests
      : contests.filter((c) => c.contentType === activeTab);

  if (isLoading) return <Loading />;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      /* FORCING THE BACKGROUND TO MATCH NAV */
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            Explore All <span className="text-primary">Contests</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {contestTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`btn btn-sm md:btn-md rounded-full px-6 ${
                activeTab === type ? "btn-primary" : "border-base-content/20"
              }`}
              /* FORCING BUTTON COLORS */
              style={
                activeTab !== type
                  ? { backgroundColor: "transparent", color: "var(--text-nav)" }
                  : {}
              }
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContests.map((contest) => (
            <div
              key={contest._id}
              className="flex flex-col h-full rounded-[2rem] overflow-hidden border transition-all duration-300 shadow-xl"
              /* THE FIX: Forcing the card to use variables instead of 'bg-white' */
              style={{
                backgroundColor: "var(--background-nav)",
                color: "var(--text-nav)",
                borderColor: "rgba(128, 128, 128, 0.1)",
              }}
            >
              <figure className="relative h-48 overflow-hidden">
                <img
                  src={contest.bannerImage}
                  alt={contest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 badge badge-primary font-bold uppercase p-3">
                  {contest.contentType}
                </div>
              </figure>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black uppercase italic leading-tight mb-4">
                  {contest.name}
                </h3>
                <p className="text-sm opacity-70 mb-6 flex-grow leading-relaxed">
                  {contest.description}
                </p>

                <div className="pt-6 border-t border-base-content/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase opacity-50">
                      Participants
                    </span>
                    <span className="text-xl font-black text-primary">
                      {contest.participants ?? 0}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(user ? `/contests/${contest._id}` : "/login")
                    }
                    className="btn btn-primary btn-sm rounded-lg font-bold"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllContests;
