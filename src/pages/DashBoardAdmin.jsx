import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [contests, setContests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingContests, setLoadingContests] = useState(true);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get("http://localhost:3000/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Contests
  const fetchContests = async () => {
    try {
      setLoadingContests(true);
      const res = await axios.get("http://localhost:3000/admin/contests");
      setContests(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load contests", "error");
    } finally {
      setLoadingContests(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchContests();
  }, []);

  // Change User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:3000/admin/users/${userId}/role`, {
        role: newRole,
      });
      Swal.fire("Success!", `Role changed to ${newRole}`, "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to change role", "error");
    }
  };

  // Update Contest Status
  const handleContestStatus = async (contestId, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/admin/contests/${contestId}/status`,
        { status }
      );
      Swal.fire("Success!", `Contest ${status.toLowerCase()}`, "success");
      fetchContests();
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Delete Contest
  const handleDeleteContest = async (contestId) => {
    const result = await Swal.fire({
      title: "Delete Contest?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/admin/contests/${contestId}`);
      Swal.fire("Deleted!", "Contest removed permanently", "success");
      fetchContests();
    } catch (err) {
      Swal.fire("Error", "Failed to delete contest", "error");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage users and contests</p>
      </div>

      {/* Manage Users */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>
        {loadingUsers ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="font-medium">{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "badge-error"
                            : user.role === "Creator"
                            ? "badge-primary"
                            : "badge-success"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="select select-bordered select-sm"
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
        )}
      </section>

      {/* Manage Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Contests</h2>
        {loadingContests ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Contest Name</th>
                  <th>Creator Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest._id}>
                    <td className="font-medium">{contest.name}</td>
                    <td>{contest.creatorEmail}</td>
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
                        {contest.status || "Pending"}
                      </span>
                    </td>
                    <td className="space-x-2">
                      {contest.status !== "Confirmed" && (
                        <button
                          onClick={() =>
                            handleContestStatus(contest._id, "Confirmed")
                          }
                          className="btn btn-sm btn-success"
                        >
                          Confirm
                        </button>
                      )}
                      {contest.status !== "Rejected" && (
                        <button
                          onClick={() =>
                            handleContestStatus(contest._id, "Rejected")
                          }
                          className="btn btn-sm btn-warning"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContest(contest._id)}
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
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
