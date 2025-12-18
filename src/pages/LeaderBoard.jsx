import React, { useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Loading from "../loading/Loading";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(
          "https://assignment-11-server-five-flax.vercel.app/all-contests"
        );
        const allContests = res.data;

        // Filter only contests with winner and status Confirmed
        const winningContests = allContests.filter(
          (c) => c.winner && c.winner.email && c.status === "Confirmed"
        );

        if (winningContests.length === 0) {
          setLeaders([]);
          return;
        }

        // Count wins per email
        const winCount = {};
        winningContests.forEach((c) => {
          const email = c.winner.email;
          winCount[email] = (winCount[email] || 0) + 1;
        });

        // Build leaderboard with safe fallback
        const leaderboard = Object.entries(winCount)
          .map(([email, wins]) => {
            // Find one contest to get name/photo
            const sampleContest = winningContests.find(
              (c) => c.winner?.email === email
            );
            return {
              email,
              name:
                sampleContest?.winner?.name || email.split("@")[0] || "Unknown",
              photo:
                sampleContest?.winner?.photo ||
                "https://via.placeholder.com/150",
              wins,
            };
          })
          .sort((a, b) => b.wins - a.wins);

        setLeaders(leaderboard);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div data-aos="fade-up" className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Leaderboard 🏆</h1>

      {leaders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl font-bold text-gray-500 mb-4">
            No winners yet!
          </p>
          <p className="text-xl text-gray-600">
            Be the first to win a contest!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Champion</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader.email} className="hover">
                  <td className="font-bold text-2xl">
                    {index === 0 && "🥇 1st"}
                    {index === 1 && "🥈 2nd"}
                    {index === 2 && "🥉 3rd"}
                    {index > 2 && `#${index + 1}`}
                  </td>
                  <td className="flex items-center gap-4 py-4">
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-primary"
                    />
                    <div>
                      <p className="font-bold text-lg">{leader.name}</p>
                      <p className="text-sm text-gray-500">{leader.email}</p>
                    </div>
                  </td>
                  <td className="text-3xl font-bold text-center text-primary">
                    {leader.wins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
