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

  // 1. STATE MANAGEMENT
  const searchQueryFromUrl =
    new URLSearchParams(location.search).get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchQueryFromUrl);
  const [activeTab, setActiveTab] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest"); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 8;

  // 2. DATA FETCHING
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["all-contests", searchQueryFromUrl],
    queryFn: async () => {
      const res = await axios.get(
        `https://assignment-11-server-five-flax.vercel.app/all-contests?search=${encodeURIComponent(
          searchQueryFromUrl || "All"
        )}`
      );
      return res.data;
    },
  });

  // 3. FULLY FUNCTIONAL FILTERING (2+ Fields: Category & Search)
  const contestTypes = ["All", ...new Set(contests.map((c) => c.contentType))];

  let filteredContests = contests.filter((c) => {
    const matchesTab = activeTab === "All" || c.contentType === activeTab;
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  filteredContests.sort((a, b) => {
    if (sortOrder === "popular")
      return (b.participantsCount || 0) - (a.participantsCount || 0);
    if (sortOrder === "newest")
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (isLoading) return <Loading />;

  return (
    <div
      className="min-h-screen py-12 px-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER & SEARCH & SORT */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            All <span className="text-primary">Contests</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name or category"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered rounded-xl bg-base-content/5 font-bold italic w-full md:w-64"
            />
            {/* Sort Dropdown */}
            <select
              className="select select-bordered rounded-xl bg-base-content/5 font-bold italic"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* CATEGORY TABS (Field 2 for Filtering) */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {contestTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setCurrentPage(1);
              }}
              className={`btn btn-sm rounded-full px-6 ${
                activeTab === type ? "btn-primary" : "btn-outline opacity-50"
              }`}
              style={activeTab !== type ? { color: "var(--text-nav)" } : {}}
            >
              {type}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentItems.map((contest) => (
            <div
              key={contest._id}
              className="card bg-base-content/5 border border-base-content/10 rounded-[2rem] overflow-hidden"
            >
              {/* ... (Keep your existing card JSX here) ... */}
              <figure>
                <img
                  src={contest.bannerImage}
                  className="h-48 w-full object-cover"
                  alt=""
                />
              </figure>
              <div className="p-6">
                <h3 className="text-xl font-black uppercase italic">
                  {contest.name}
                </h3>
                <p className="text-xs opacity-70 my-4 line-clamp-2">
                  {contest.description}
                </p>
                <div className="flex justify-between items-center border-t border-base-content/10 pt-4">
                  <span className="font-bold">
                    Participants: {contest.participants || 0}
                  </span>
                  <button
                    onClick={() =>
                      navigate(user ? `/contests/${contest._id}` : "/login")
                    }
                    className="btn btn-primary btn-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION BUTTONS */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo(0, 0);
                }}
                className={`btn btn-square ${
                  currentPage === i + 1 ? "btn-primary" : "btn-ghost"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContests;
