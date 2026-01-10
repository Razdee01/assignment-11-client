import React, { useContext, useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { updateProfile, reload } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import {
  FaTrophy,
  FaMedal,
  FaEdit,
  FaSave,
  FaTimes,
  FaChartPie,
} from "react-icons/fa";

const DeshBoardUser = () => {
  const { user } = useContext(AuthContext);

  const [participatedContests, setParticipatedContests] = useState([]);
  const [winningContests, setWinningContests] = useState([]);
  const [loadingParticipated, setLoadingParticipated] = useState(true);
  const [loadingWinnings, setLoadingWinnings] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || "");
  const [editedPhoto, setEditedPhoto] = useState(user?.photoURL || "");
  const [editedBio, setEditedBio] = useState("Contest Enthusiast");

  useEffect(() => {
    const fetchParticipated = async () => {
      if (!user?.email) return;
      try {
        setLoadingParticipated(true);
        const response = await axios.get(
          `https://assignment-11-server-five-flax.vercel.app/participated-contests/${user.email}`
        );
        setParticipatedContests(response.data || []);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoadingParticipated(false);
      }
    };
    fetchParticipated();
  }, [user?.email]);

  useEffect(() => {
    const fetchWinnings = async () => {
      if (!user?.email) return;
      try {
        setLoadingWinnings(true);
        const response = await axios.get(
          `https://assignment-11-server-five-flax.vercel.app/winning-contests/${user.email}`
        );
        setWinningContests(response.data || []);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoadingWinnings(false);
      }
    };
    fetchWinnings();
  }, [user?.email]);

  const totalParticipated = participatedContests.length;
  const totalWon = winningContests.length;
  const winPercentage =
    totalParticipated > 0
      ? ((totalWon / totalParticipated) * 100).toFixed(1)
      : 0;

  const handleSaveProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName,
        photoURL: editedPhoto,
      });
      await reload(auth.currentUser);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      setIsEditing(false);
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
        {/* Header Section */}
        <header className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            User <span className="text-primary">Dashboard</span>
          </h1>
          <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-xs">
            Welcome back, {user?.displayName || "Contestant"}
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Profile & Stats */}
          <div className="xl:col-span-1 space-y-8">
            <section className="p-8 rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaChartPie size={120} />
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="avatar mb-6">
                  <div className="w-32 h-32 rounded-[2rem] ring ring-primary ring-offset-base-100 ring-offset-4">
                    <img
                      src={
                        isEditing
                          ? editedPhoto
                          : user?.photoURL || "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                    />
                  </div>
                </div>

                {isEditing ? (
                  <div className="w-full space-y-3">
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input input-bordered w-full rounded-xl bg-transparent font-bold"
                      placeholder="Name"
                    />
                    <input
                      value={editedPhoto}
                      onChange={(e) => setEditedPhoto(e.target.value)}
                      className="input input-bordered w-full rounded-xl bg-transparent font-bold"
                      placeholder="Photo URL"
                    />
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="textarea textarea-bordered w-full rounded-xl bg-transparent font-bold"
                      rows="2"
                      placeholder="Bio"
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
                      {user?.displayName || user?.email}
                    </h3>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1 mb-4">
                      {editedBio}
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="p-4 rounded-2xl bg-base-content/5 border border-base-content/5">
                        <p className="text-[10px] font-black opacity-40 uppercase">
                          Participated
                        </p>
                        <p className="text-2xl font-black text-primary italic">
                          {totalParticipated}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-base-content/5 border border-base-content/5">
                        <p className="text-[10px] font-black opacity-40 uppercase">
                          Won
                        </p>
                        <p className="text-2xl font-black text-success italic">
                          {totalWon}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                      <div
                        className="radial-progress text-primary font-black italic"
                        style={{
                          "--value": winPercentage,
                          "--size": "8rem",
                          "--thickness": "1rem",
                        }}
                        role="progressbar"
                      >
                        {winPercentage}%
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-50">
                        Career Win Rate
                      </p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline btn-sm rounded-xl mt-8 w-full border-base-content/20 uppercase font-black italic"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Contests & Winnings */}
          <div className="xl:col-span-2 space-y-8">
            {/* Participated Table */}
            <section className="p-8 rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <FaMedal className="text-primary" /> Participated Contests
              </h2>
              {participatedContests.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic font-bold uppercase">
                  No records found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr
                        className="border-b border-base-content/10"
                        style={{ color: "var(--text-nav)" }}
                      >
                        <th className="bg-transparent uppercase font-black italic">
                          Contest Name
                        </th>
                        <th className="bg-transparent uppercase font-black italic text-center">
                          Status
                        </th>
                        <th className="bg-transparent uppercase font-black italic text-right">
                          Prize
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {participatedContests.map((contest) => (
                        <tr
                          key={contest._id}
                          className="border-b border-base-content/5 hover:bg-base-content/5"
                        >
                          <td className="font-bold uppercase italic tracking-tighter">
                            {contest.name}
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge font-black text-[10px] italic py-3 px-4 rounded-lg ${
                                new Date() > new Date(contest.deadline)
                                  ? "badge-error"
                                  : "badge-success"
                              }`}
                            >
                              {new Date() > new Date(contest.deadline)
                                ? "CLOSED"
                                : "ACTIVE"}
                            </span>
                          </td>
                          <td className="text-right font-black text-primary italic">
                            ৳{contest.prizeMoney}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Winning Contests Grid */}
            <section>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <FaTrophy className="text-warning" /> Hall of Fame 🏆
              </h2>
              {winningContests.length === 0 ? (
                <div className="p-12 rounded-[2.5rem] border-2 border-dashed border-base-content/10 text-center opacity-30 italic font-bold uppercase">
                  The trophy cabinet is empty. Keep competing!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {winningContests.map((win) => (
                    <div
                      key={win._id}
                      className="group p-6 rounded-[2rem] bg-gradient-to-br from-warning/20 to-transparent border border-warning/20 hover:scale-[1.02] transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">
                            {win.name}
                          </h3>
                          <p className="text-[10px] font-bold opacity-60 uppercase mt-1">
                            Claimed on:{" "}
                            {new Date(
                              win.winnerDeclaredAt || win.deadline
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <FaTrophy className="text-3xl text-warning group-hover:rotate-12 transition-transform" />
                      </div>
                      <div className="mt-6">
                        <p className="text-3xl font-black text-warning italic tracking-tighter">
                          ৳{win.prizeMoney}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeshBoardUser;
