import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import DashBoard from "./DashBoard";

const DashBoardUser = () => {
  const { user } = useContext(AuthContext);

  // Hardcoded demo data for User Dashboard
  const participatedContests = [
    {
      id: 1,
      name: "Pixel Art Mini Game Challenge",
      paymentStatus: "Paid",
      deadline: "2025-12-20",
    },
    {
      id: 2,
      name: "Eco-Friendly Business Idea",
      paymentStatus: "Paid",
      deadline: "2025-12-25",
    },
    {
      id: 3,
      name: "Logo Design Battle",
      paymentStatus: "Paid",
      deadline: "2026-01-10",
    },
    {
      id: 4,
      name: "Short Story Writing Contest",
      paymentStatus: "Pending",
      deadline: "2026-01-15",
    },
  ];

  // Sort by upcoming deadline (earliest first)
  const sortedParticipated = [...participatedContests].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  const winningContests = [
    {
      id: 1,
      name: "Nature Photography Contest 2024",
      prize: "৳8,500 Cash",
      rank: "1st Place",
      dateWon: "2025-11-01",
    },
    {
      id: 2,
      name: "Mobile UI Design Challenge",
      prize: "৳5,000 Cash + Feature",
      rank: "2nd Place",
      dateWon: "2025-10-15",
    },
    {
      id: 3,
      name: "Meme Creation Masters",
      prize: "৳2,000 Gift Card",
      rank: "3rd Place",
      dateWon: "2025-09-20",
    },
  ];

  const profileData = {
    name: user?.displayName || "John Doe",
    photo: user?.photoURL || "https://via.placeholder.com/150",
    bio: "Passionate designer and contest enthusiast. Always chasing creativity!",
    participated: 15,
    won: 5,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profileData.name);
  const [editedPhoto, setEditedPhoto] = useState(profileData.photo);
  const [editedBio, setEditedBio] = useState(profileData.bio);

  const winPercentage =
    profileData.participated > 0
      ? ((profileData.won / profileData.participated) * 100).toFixed(1)
      : 0;

  const handleSaveProfile = () => {
    // In real app: send update to backend
    alert("Profile updated successfully! 🎉");
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* User Dashboard Header */}
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
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Contest Name</th>
                <th>Payment Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {sortedParticipated.map((contest) => (
                <tr key={contest.id}>
                  <td className="font-medium">{contest.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        contest.paymentStatus === "Paid"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {contest.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(contest.deadline).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* My Winning Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Winning Contests 🏆
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winningContests.map((win) => (
            <div
              key={win.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body text-center">
                <div className="text-5xl mb-4">
                  {win.rank === "1st Place" && "🥇"}
                  {win.rank === "2nd Place" && "🥈"}
                  {win.rank === "3rd Place" && "🥉"}
                </div>
                <h3 className="card-title justify-center text-lg">
                  {win.name}
                </h3>
                <p className="text-2xl font-bold text-primary mt-4">
                  {win.prize}
                </p>
                <p className="text-sm text-gray-600 mt-2">{win.rank}</p>
                <p className="text-sm italic mt-2">
                  Won on: {new Date(win.dateWon).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {winningContests.length === 0 && (
            <p className="text-center col-span-full text-gray-500 text-xl">
              No wins yet. Keep participating! 💪
            </p>
          )}
        </div>
      </section>

      {/* My Profile */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Profile Info & Edit Form */}
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={isEditing ? editedPhoto : profileData.photo}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg"
              />
              <h3 className="text-2xl font-bold mt-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="input input-bordered text-center text-2xl"
                  />
                ) : (
                  profileData.name
                )}
              </h3>
            </div>

            {isEditing ? (
              <>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows="4"
                    className="textarea textarea-bordered w-full"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary"
                  >
                    Save Changes
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
              <div className="text-center space-y-4">
                <p className="italic text-lg max-w-md mx-auto">
                  {profileData.bio}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Win Percentage Chart */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-6">Win Statistics</h3>
            <div
              className="radial-progress bg-base-100 text-primary shadow-xl"
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
            <div className="stats shadow mt-8">
              <div className="stat text-center">
                <div className="stat-title">Total Participated</div>
                <div className="stat-value text-primary">
                  {profileData.participated}
                </div>
              </div>
              <div className="stat text-center">
                <div className="stat-title">Contests Won</div>
                <div className="stat-value text-success">{profileData.won}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashBoardUser;
