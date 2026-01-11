import React, { useContext, useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { updateProfile, reload } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaTrophy, FaMedal, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const DeshBoardUser = () => {
  const { user } = useContext(AuthContext);

  const [participatedContests, setParticipatedContests] = useState([]);
  const [winningContests, setWinningContests] = useState([]);
  const [loadingParticipated, setLoadingParticipated] = useState(true);

  // Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [editedName, setEditedName] = useState(user?.displayName || "");
  const [editedPhoto, setEditedPhoto] = useState(user?.photoURL || "");
  const [editedBio, setEditedBio] = useState("Contest Enthusiast");

  // Sync state if user object changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEditedName(user.displayName || "");
      setEditedPhoto(user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        setLoadingParticipated(true);
        const [partRes, winRes] = await Promise.all([
          axios.get(
            `https://assignment-11-server-five-flax.vercel.app/participated-contests/${user.email}`
          ),
          axios.get(
            `https://assignment-11-server-five-flax.vercel.app/winning-contests/${user.email}`
          ),
        ]);
        setParticipatedContests(partRes.data || []);
        setWinningContests(winRes.data || []);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoadingParticipated(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const totalParticipated = participatedContests.length;
  const totalWon = winningContests.length;
  const totalLost = totalParticipated - totalWon;

  const chartData = [
    { name: "Won", value: totalWon },
    { name: "Others", value: totalLost > 0 ? totalLost : 0 },
  ];

  const COLORS = ["#10B981", "#3b82f644"];

  const handleSaveProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName,
        photoURL: editedPhoto,
      });

      await reload(auth.currentUser);

      setDisplayName(editedName); // Update header instantly
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  if (loadingParticipated) return <Loading />;

  return (
    <div
      className="min-h-screen py-12 px-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            User <span className="text-primary">Dashboard</span>
          </h1>
          <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-xs">
            Welcome back, {displayName || "Contestant"}
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="xl:col-span-1 space-y-8">
            <section className="p-8 rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="avatar mb-6">
                  <div className="w-32 h-32 rounded-[2rem] ring ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden">
                    <img
                      src={
                        isEditing
                          ? editedPhoto
                          : user?.photoURL ||
                            "https://i.ibb.co/0QZCv5C/user.png"
                      }
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {isEditing ? (
                  <div className="w-full space-y-3">
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input input-bordered w-full rounded-xl bg-transparent"
                      placeholder="Name"
                    />
                    <input
                      value={editedPhoto}
                      onChange={(e) => setEditedPhoto(e.target.value)}
                      className="input input-bordered w-full rounded-xl bg-transparent"
                      placeholder="Photo URL"
                    />
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="textarea textarea-bordered w-full rounded-xl bg-transparent"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="btn btn-primary flex-1 rounded-xl"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-ghost flex-1 rounded-xl"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                      {displayName || user?.email}
                    </h3>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1 mb-6">
                      {editedBio}
                    </p>

                    {/* CHART FIX: We use a wrapper with a defined height and width */}
                    <div className="w-full h-64 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                            isAnimationActive={true}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="none"
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center Stats Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-3xl font-black italic">
                          {totalWon}
                        </span>
                        <span className="text-[10px] uppercase font-bold opacity-50">
                          Wins
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline btn-sm rounded-xl mt-4 w-full border-base-content/20 uppercase font-black italic"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-2 space-y-8">
            <section className="p-8 rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-xl">
              <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                <FaMedal className="text-primary" /> Participation Log
              </h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr
                      className="border-b border-base-content/10"
                      style={{ color: "var(--text-nav)" }}
                    >
                      <th className="bg-transparent uppercase font-black italic">
                        Contest
                      </th>
                      <th className="bg-transparent uppercase font-black italic text-center">
                        Status
                      </th>
                      <th className="bg-transparent uppercase font-black italic text-right">
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participatedContests.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-base-content/5 hover:bg-base-content/5"
                      >
                        <td className="font-bold uppercase italic text-xs">
                          {c.name}
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge font-black text-[9px] p-3 rounded-lg ${
                              new Date() > new Date(c.deadline)
                                ? "badge-error"
                                : "badge-success"
                            }`}
                          >
                            {new Date() > new Date(c.deadline)
                              ? "CLOSED"
                              : "ACTIVE"}
                          </span>
                        </td>
                        <td className="text-right font-black text-primary italic">
                          ৳{c.entryFee || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                <FaTrophy className="text-warning" /> Victory Shelf
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {winningContests.length === 0 ? (
                  <div className="col-span-2 p-12 rounded-[2.5rem] border-2 border-dashed border-base-content/10 text-center opacity-30 italic font-bold uppercase">
                    No trophies yet. Keep competing!
                  </div>
                ) : (
                  winningContests.map((win) => (
                    <div
                      key={win._id}
                      className="p-6 rounded-[2rem] bg-gradient-to-br from-warning/20 to-transparent border border-warning/20 flex justify-between items-center transition-transform hover:scale-105"
                    >
                      <div>
                        <h3 className="text-md font-black uppercase italic">
                          {win.name}
                        </h3>
                        <p className="text-2xl font-black text-warning italic">
                          ৳{win.prizeMoney}
                        </p>
                      </div>
                      <FaTrophy className="text-3xl text-warning" />
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeshBoardUser;
