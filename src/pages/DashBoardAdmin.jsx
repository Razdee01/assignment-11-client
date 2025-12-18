import React, { useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
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
  const handleRoleChange = async (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    const confirm = await Swal.fire({
      title: "Change Role?",
      text: `Change role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(`http://localhost:3000/admin/users/${userId}/role`, {
        role: newRole,
      });
      Swal.fire("Success!", `Role updated to ${newRole}`, "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
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
        ) : users.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No users found
          </p>
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
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.name || "N/A"}</td>
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
                        {u.role || "User"}
                      </span>
                    </td>
                    <td>
                      <select
                        value={u.role || "User"}
                        onChange={(e) =>
                          handleRoleChange(
                            u._id,
                            u.role || "User",
                            e.target.value
                          )
                        }
                        className="select select-bordered select-sm w-full max-w-xs"
                      >
                        <option value="User">User</option>
                        <option value="Creator">Creator</option>
                        <option value="Admin">Admin</option>
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
        ) : contests.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No contests found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Contest Name</th>
                  <th>Creator</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((c) => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.name}</td>
                    <td>{c.creatorEmail}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === "Confirmed"
                            ? "badge-success"
                            : c.status === "Rejected"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {c.status || "Pending"}
                      </span>
                    </td>
                    <td className="space-x-2">
                      {c.status !== "Confirmed" && (
                        <button
                          onClick={() =>
                            handleContestStatus(c._id, "Confirmed")
                          }
                          className="btn btn-sm btn-success"
                        >
                          Confirm
                        </button>
                      )}
                      {c.status !== "Rejected" && (
                        <button
                          onClick={() => handleContestStatus(c._id, "Rejected")}
                          className="btn btn-sm btn-warning"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContest(c._id)}
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
