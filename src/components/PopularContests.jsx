import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const PopularContests = () => {
  const navigate = useNavigate();

  // 1. Fetch API with TanStack Query
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["popular-contests"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/popular-contests");
      return res.data;
    },
  });

  // 2. Simulated login check (replace with real auth context)
  const user = null; // <--- replace using: const { user } = useAuth();

  if (isLoading) {
    return (
      <p className="text-center py-10 text-xl font-semibold">Loading...</p>
    );
  }

  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/contest/${id}`);
    }
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🔥 Popular Contests</h2>
        <Link to="/contests">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Show All
          </button>
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
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
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularContests;
