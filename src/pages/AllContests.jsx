import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";

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
        `http://localhost:3000/all-contests?search=${encodeURIComponent(
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
    return searchQuery && searchQuery !== "All" ? searchQuery : "All";
  });

  // Filter contests by active tab
  const filteredContests =
    activeTab === "All"
      ? contests
      : contests.filter((c) => c.contentType === activeTab);

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
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6">All Contests</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {contestTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            No contests found.
          </p>
        ) : (
          filteredContests.map((contest) => (
            <div
              key={contest._id}
              className="border rounded-xl shadow-md p-4 bg-white"
            >
              <img
                src={contest.bannerImage}
                alt={contest.name}
                className="rounded-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-3">{contest.name}</h3>
              <p className="text-gray-600 mt-2">
                {contest.description}...
              </p>
              <p className="mt-2 font-medium">
                Participants:{" "}
                <span className="text-blue-600">
                  {contest.participants ?? 0}
                </span>
              </p>
              <button
                onClick={() => handleDetails(contest._id)}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllContests;
