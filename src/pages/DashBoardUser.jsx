import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";

const DeshBoardUser = () => {
  const { user } = useContext(AuthContext);

  // State for real data
  const [participatedContests, setParticipatedContests] = useState([]);
  const [winningContests, setWinningContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Participated Contests
  useEffect(() => {
    const fetchParticipated = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/participated-contests/${user.email}` // ← NEW ENDPOINT
        );
        setParticipatedContests(response.data); // already sorted by backend
      } catch (error) {
        console.error("Failed to load participated contests:", error);
        alert("Could not load participated contests");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipated();
  }, [user?.email]);

  // Fetch Winning Contests (contests where user is winner)
  useEffect(() => {
    const fetchWinnings = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/winning-contests/${user.email}`
        );
        setWinningContests(response.data);
      } catch (error) {
        console.error("Failed to load winning contests:", error);
      }
    };

    fetchWinnings();
  }, [user?.email]);

  // Calculate win percentage
  const totalParticipated = participatedContests.length;
  const totalWon = winningContests.length;
  const winPercentage =
    totalParticipated > 0
      ? ((totalWon / totalParticipated) * 100).toFixed(1)
      : 0;

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome back, {user?.displayName || user?.email || "Contestant"}!
        </p>
      </div>

      {/* My Participated Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Participated Contests
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : participatedContests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">
              You haven't participated in any contests yet.
            </p>
            <p className="text-sm mt-2">Browse contests and join one! 🚀</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Contest Name</th>
                  <th>Entry Fee</th>
                  <th>Prize Money</th>
                  <th>Deadline</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {participatedContests.map((contest) => (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.name}</td>
                    <td>৳{contest.entryFee}</td>
                    <td>৳{contest.prizeMoney}</td>
                    <td>{new Date(contest.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-success badge-lg">Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* My Winning Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Winning Contests 🏆
        </h2>
        {winningContests.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            No wins yet. Keep participating! 💪
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winningContests.map((win) => (
              <div
                key={win._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body text-center">
                  <div className="text-6xl mb-4">🥇</div>
                  <h3 className="card-title justify-center text-lg">
                    {win.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mt-4">
                    ৳{win.prizeMoney}
                  </p>
                  <p className="text-sm italic mt-2">
                    Won on: {new Date(win.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My Profile & Stats */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Profile & Stats
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg mb-4"
            />
            <h3 className="text-2xl font-bold">
              {user?.displayName || user?.email}
            </h3>
            <p className="text-lg mt-2 text-gray-600">Contest Enthusiast</p>
          </div>

          {/* Win Stats */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6">Win Statistics</h3>
            <div
              className="radial-progress bg-base-100 text-primary shadow-xl mb-8"
              style={{
                "--value": winPercentage,
                "--size": "12rem",
                "--thickness": "1.5rem",
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">{winPercentage}%</span>
                <span className="text-lg">Win Rate</span>
              </div>
            </div>
            <div className="stats shadow w-full">
              <div className="stat text-center">
                <div className="stat-title">Participated</div>
                <div className="stat-value text-primary">
                  {totalParticipated}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Won</div>
                <div className="stat-value text-success">{totalWon}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeshBoardUser;
