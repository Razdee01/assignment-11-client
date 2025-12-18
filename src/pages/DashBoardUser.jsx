import React, { useContext, useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { updateProfile, reload } from "firebase/auth";
import { auth } from "../firebase/firebase.config"; // ← make sure this path is correct

const DeshBoardUser = () => {
  const { user } = useContext(AuthContext); // use setUser to update context

  const [participatedContests, setParticipatedContests] = useState([]);
  const [winningContests, setWinningContests] = useState([]);
  const [loadingParticipated, setLoadingParticipated] = useState(true);
  const [loadingWinnings, setLoadingWinnings] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || "");
  const [editedPhoto, setEditedPhoto] = useState(user?.photoURL || "");
  const [editedBio, setEditedBio] = useState("Contest Enthusiast"); // you can save bio in DB later

  // Fetch Participated Contests
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

  // Fetch Winning Contests
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

  // Save Profile
  const handleSaveProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName,
        photoURL: editedPhoto,
      });

      await reload(auth.currentUser);

      Swal.fire(
        "Success!",
        "Profile updated! Refresh to see changes.",
        "success"
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };
  if (loadingParticipated) return <Loading />;

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome back, {user?.displayName || user?.email || "Contestant"}!
        </p>
      </div>

      {/* Participated Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Participated Contests
        </h2>
        {participatedContests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">
              You haven't participated in any contests yet.
            </p>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {participatedContests.map((contest) => {
                  const ended = new Date() > new Date(contest.deadline);
                  return (
                    <tr key={contest._id}>
                      <td className="font-medium">{contest.name}</td>
                      <td>৳{contest.entryFee || "N/A"}</td>
                      <td>৳{contest.prizeMoney}</td>
                      <td>{new Date(contest.deadline).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge badge-lg ${
                            ended ? "badge-error" : "badge-success"
                          }`}
                        >
                          {ended ? "Closed" : "Paid"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Winning Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Winning Contests 🏆
        </h2>
        {loadingWinnings ? (
          <Loading />
        ) : winningContests.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No wins yet — keep going! 💪
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winningContests.map((win) => (
              <div
                key={win._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
              >
                <div className="card-body text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="card-title justify-center">{win.name}</h3>
                  <p className="text-2xl font-bold text-success mt-4">
                    ৳{win.prizeMoney}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Won on:{" "}
                    {new Date(
                      win.winnerDeclaredAt || win.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Profile & Stats */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Profile & Stats
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Profile */}
          <div className="flex flex-col items-center text-center">
            <img
              src={
                isEditing
                  ? editedPhoto
                  : user?.photoURL || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg mb-4"
            />
            <h3 className="text-2xl font-bold">
              {isEditing ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="input input-bordered text-center"
                  placeholder="Your name"
                />
              ) : (
                user?.displayName || user?.email
              )}
            </h3>

            {isEditing ? (
              <>
                <input
                  value={editedPhoto}
                  onChange={(e) => setEditedPhoto(e.target.value)}
                  placeholder="Photo URL"
                  className="input input-bordered mt-4 w-full max-w-xs"
                />
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows="3"
                  placeholder="Your bio"
                  className="textarea textarea-bordered mt-4 w-full max-w-xs"
                />
                <div className="mt-6 space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-success"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg mt-4 text-gray-600 max-w-md">
                  {editedBio}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary mt-6"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6">Win Statistics</h3>
            <div
              className="radial-progress text-primary mb-8"
              style={{
                "--value": winPercentage,
                "--size": "12rem",
                "--thickness": "2rem",
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold">{winPercentage}%</span>
                <span className="text-lg">Win Rate</span>
              </div>
            </div>
            <div className="stats shadow">
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
