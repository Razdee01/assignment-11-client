import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";

const AllContests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  // 1. Fetch all contests
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["all-contests"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/all-contests");
      return res.data;
    },
  });

  // 2. Extract unique contest types for tabs
  const contestTypes = ["All", ...new Set(contests.map((c) => c.contentType))];

  // 3. Filter contests by active tab
  const filteredContests =
    activeTab === "All"
      ? contests
      : contests.filter((c) => c.contentType === activeTab);

  // 4. Simulated login check (replace with real auth)
  const user = null; // replace with auth context: const { user } = useAuth();

  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/contest/${id}`);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center py-10 text-xl font-semibold">Loading...</p>
    );
  }

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

      {/* Contests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
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
              {contest.description.slice(0, 80)}...
            </p>

            <p className="mt-2 font-medium">
              Participants:{" "}
              <span className="text-blue-600">{contest.participants ?? 0}</span>
            </p>

            <button
              onClick={() => handleDetails(contest._id)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllContests;
