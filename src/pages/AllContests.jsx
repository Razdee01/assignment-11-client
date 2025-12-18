import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../utilitis/axiosConfig";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import axios from "../utilitis/axiosConfig";

const AllContests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useContext(AuthContext);

  // Get search query from URL
  const searchQuery =
    new URLSearchParams(location.search).get("search") || "All";

  // Fetch contests
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["all-contests", searchQuery],
    queryFn: async () => {
      const res = await axios.get(
        `https://assignment-11-server-five-flax.vercel.app/all-contests?search=${encodeURIComponent(
          searchQuery
        )}`
      );
      return res.data;
    },
  });

  // Extract contest types
  const contestTypes = ["All", ...new Set(contests.map((c) => c.contentType))];

  // Set initial active tab from search query
  const [activeTab, setActiveTab] = useState(() => {
    const query = new URLSearchParams(location.search).get("search");
    return query && query !== "All" ? query : "All";
  });

  // Filter contests by active tab
  const filteredContests =
    activeTab === "All"
      ? contests
      : contests.filter((c) => c.contentType === activeTab);

  // Pagination: 10 per page
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContests = filteredContests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);

  // Navigate to contest details
  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/contests/${id}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div data-aos="fade-up" className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">All Contests</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        {contestTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveTab(type);
              setCurrentPage(1); // reset to page 1 when tab changes
            }}
            className={`px-5 py-3 rounded-full font-medium text-lg transition-all ${
              activeTab === type
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Contest Grid */}
      {paginatedContests.length === 0 ? (
        <p className="text-center col-span-3 text-gray-500 text-xl py-10">
          No contests found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedContests.map((contest) => (
            <div
              key={contest._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <figure>
                <img
                  src={contest.bannerImage}
                  alt={contest.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl">{contest.name}</h3>
                <p className="text-gray-600">{contest.description}...</p>
                <p className="font-medium">
                  Participants:{" "}
                  <span className="text-blue-600">
                    {contest.participants ?? 0}
                  </span>
                </p>
                <button
                  onClick={() => handleDetails(contest._id)}
                  className="btn btn-primary mt-4"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-outline btn-sm"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : "btn-ghost"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllContests;
