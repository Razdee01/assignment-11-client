import React, { useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Loading from "../loading/Loading";
import { FaCrown, FaTrophy, FaStar } from "react-icons/fa";

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

        const winningContests = allContests.filter(
          (c) => c.winner && c.winner.email && c.status === "Confirmed"
        );

        if (winningContests.length === 0) {
          setLeaders([]);
          return;
        }

        const winCount = {};
        winningContests.forEach((c) => {
          const email = c.winner.email;
          winCount[email] = (winCount[email] || 0) + 1;
        });

        const leaderboard = Object.entries(winCount)
          .map(([email, wins]) => {
            const sampleContest = winningContests.find(
              (c) => c.winner?.email === email
            );
            return {
              email,
              name:
                sampleContest?.winner?.name ||
                email.split("@")[0] ||
                "Unknown Participant",
              photo:
                sampleContest?.winner?.photo ||
                "https://i.ibb.co/mR79Y6B/user.png",
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

  // Separate top 3 for the podium
  const topThree = leaders.slice(0, 3);
  const theRest = leaders.slice(3);

  return (
    <div
      className="min-h-screen py-20 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Hall of <span className="text-primary">Fame</span>
          </h1>
          <p className="opacity-50 font-bold uppercase tracking-[0.4em] text-[10px]">
            Elite Competitive Rankings
          </p>
        </div>

        {leaders.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-base-content/10 rounded-[3rem]">
            <FaStar className="text-6xl mx-auto opacity-10 mb-4" />
            <p className="text-2xl font-black uppercase italic opacity-40">
              No Champions Recorded Yet
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* PODIUM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-20 px-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center space-y-4 group">
                  <div className="relative">
                    <img
                      src={topThree[1].photo}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-400 p-1 bg-base-content/5 group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-black uppercase italic text-sm">
                      {topThree[1].name}
                    </h3>
                    <p className="text-primary font-black italic">
                      {topThree[1].wins} WINS
                    </p>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center space-y-6 group">
                  <FaCrown className="text-yellow-500 text-4xl animate-bounce" />
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={topThree[0].photo}
                      alt=""
                      className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 p-1 bg-base-content/5 group-hover:scale-110 transition-transform relative z-10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-black italic text-xl z-20">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-black uppercase italic text-xl">
                      {topThree[0].name}
                    </h3>
                    <p className="text-primary font-black italic text-2xl">
                      {topThree[0].wins} WINS
                    </p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="order-3 flex flex-col items-center space-y-4 group">
                  <div className="relative">
                    <img
                      src={topThree[2].photo}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-700 p-1 bg-base-content/5 group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-black uppercase italic text-sm">
                      {topThree[2].name}
                    </h3>
                    <p className="text-primary font-black italic">
                      {topThree[2].wins} WINS
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TABLE SECTION (Rest of the players) */}
            {theRest.length > 0 && (
              <div className="overflow-x-auto rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl">
                <table className="table w-full">
                  <thead>
                    <tr
                      className="border-b border-base-content/10"
                      style={{ color: "var(--text-nav)" }}
                    >
                      <th className="bg-transparent uppercase font-black italic opacity-50">
                        Rank
                      </th>
                      <th className="bg-transparent uppercase font-black italic opacity-50">
                        Champion
                      </th>
                      <th className="bg-transparent uppercase font-black italic opacity-50 text-right">
                        Wins
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {theRest.map((leader, index) => (
                      <tr
                        key={leader.email}
                        className="border-b border-base-content/5 hover:bg-base-content/5 transition-colors"
                      >
                        <td className="font-black italic opacity-30 text-lg">
                          #{index + 4}
                        </td>
                        <td>
                          <div className="flex items-center gap-4">
                            <img
                              src={leader.photo}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-base-content/10"
                            />
                            <div>
                              <p className="font-black uppercase italic text-sm">
                                {leader.name}
                              </p>
                              <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                                {leader.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right">
                          <span className="text-xl font-black italic text-primary">
                            {leader.wins}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
