import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const DashBoardAdmin = () => {
  const { user } = useContext(AuthContext);

  // Hardcoded demo data for Admin Dashboard
  const allUsers = [
    {
      id: 1,
      name: "Kablu Bhai",
      email: "kablumiya@gmail.com",
      role: "Creator",
      photo: "https://i.ibb.co/vxshgcjY/Full-Logo.png",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      photo: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Admin Pro",
      email: "admin@example.com",
      role: "Admin",
      photo: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Sarah Creator",
      email: "sarah@example.com",
      role: "Creator",
      photo: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "Mike Contestant",
      email: "mike@example.com",
      role: "User",
      photo: "https://via.placeholder.com/100",
    },
  ];

  const allContests = [
    {
      id: 1,
      name: "Pixel Art Challenge",
      creatorEmail: "kablumiya@gmail.com",
      creatorName: "Kablu Bhai",
      entryFee: 150,
      prizeMoney: 2000,
      status: "Pending",
    },
    {
      id: 2,
      name: "Logo Design Masters",
      creatorEmail: "sarah@example.com",
      creatorName: "Sarah Creator",
      entryFee: 200,
      prizeMoney: 5000,
      status: "Pending",
    },
    {
      id: 3,
      name: "Nature Photography 2025",
      creatorEmail: "john@example.com",
      creatorName: "John Doe",
      entryFee: 100,
      prizeMoney: 3000,
      status: "Confirmed",
    },
    {
      id: 4,
      name: "Meme Battle Royale",
      creatorEmail: "kablumiya@gmail.com",
      creatorName: "Kablu Bhai",
      entryFee: 100,
      prizeMoney: 1500,
      status: "Rejected",
    },
  ];

  const [users, setUsers] = useState(allUsers);
  const [contests, setContests] = useState(allContests);

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    alert(`User role updated to ${newRole}!`);
  };

  // Handle contest actions
  const handleContestAction = (contestId, action) => {
    if (action === "delete") {
      setContests(contests.filter((c) => c.id !== contestId));
      alert("Contest deleted permanently!");
    } else {
      setContests(
        contests.map((c) =>
          c.id === contestId
            ? { ...c, status: action === "confirm" ? "Confirmed" : "Rejected" }
            : c
        )
      );
      alert(`Contest ${action === "confirm" ? "approved" : "rejected"}!`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Admin Dashboard Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {user?.displayName || user?.email || "Admin"}! Manage users
          and contests.
        </p>
      </div>

      {/* Manage Users Table */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={u.photo} alt={u.name} />
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "Admin"
                          ? "badge-error"
                          : u.role === "Creator"
                          ? "badge-primary"
                          : "badge-success"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="select select-bordered select-sm w-full max-w-xs"
                    >
                      <option>User</option>
                      <option>Creator</option>
                      <option>Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manage Contests Table */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Manage Contests</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Contest Name</th>
                <th>Creator</th>
                <th>Entry Fee</th>
                <th>Prize</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.id}>
                  <td className="font-medium">{contest.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{contest.creatorName}</span>
                      <span className="text-sm text-gray-500">
                        ({contest.creatorEmail})
                      </span>
                    </div>
                  </td>
                  <td>৳{contest.entryFee}</td>
                  <td>৳{contest.prizeMoney}</td>
                  <td>
                    <span
                      className={`badge ${
                        contest.status === "Confirmed"
                          ? "badge-success"
                          : contest.status === "Rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    {contest.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleContestAction(contest.id, "confirm")
                          }
                          className="btn btn-sm btn-success"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleContestAction(contest.id, "reject")
                          }
                          className="btn btn-sm btn-warning"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleContestAction(contest.id, "delete")}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashBoardAdmin;
