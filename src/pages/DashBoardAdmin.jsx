import React, { useEffect, useState } from "react";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import {
  FaUsersCog,
  FaTrophy,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaUserShield,
  FaUserEdit,
  FaUser,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [contests, setContests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingContests, setLoadingContests] = useState(true);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(
        "https://assignment-11-server-five-flax.vercel.app/admin/users"
      );
      setUsers(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Contests
  const fetchContests = async () => {
    try {
      setLoadingContests(true);
      const res = await axios.get(
        "https://assignment-11-server-five-flax.vercel.app/admin/contests"
      );
      setContests(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load contests", "error");
    } finally {
      setLoadingContests(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchContests();
  }, []);

  const handleRoleChange = async (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;
    const confirm = await Swal.fire({
      title: "Promote User?",
      text: `Are you sure you want to change role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      background: "var(--background-nav)",
      color: "var(--text-nav)",
      confirmButtonColor: "#007BFF",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.patch(
        `https://assignment-11-server-five-flax.vercel.app/admin/users/${userId}/role`,
        { role: newRole }
      );
      Swal.fire("Success!", `Role updated to ${newRole}`, "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Error", "Failed to change role", "error");
    }
  };

  const handleContestStatus = async (contestId, status) => {
    try {
      await axios.patch(
        `https://assignment-11-server-five-flax.vercel.app/admin/contests/${contestId}/status`,
        { status }
      );
      Swal.fire({
        icon: "success",
        title: `Contest ${status}`,
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      fetchContests();
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDeleteContest = async (contestId) => {
    const result = await Swal.fire({
      title: "Permanently Delete?",
      text: "This contest data will be wiped forever.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `https://assignment-11-server-five-flax.vercel.app/admin/contests/${contestId}`
      );
      Swal.fire("Deleted!", "Contest removed.", "success");
      fetchContests();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  if (loadingUsers || loadingContests) return <Loading />;

  return (
    <div
      className="min-h-screen py-20 px-4 md:px-10 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* DASHBOARD HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Control <span className="text-primary">Center</span>
          </h1>
          <p className="opacity-50 font-bold uppercase tracking-[0.4em] text-[10px]">
            Administrative Overwatch
          </p>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[2rem] bg-base-content/5 border border-base-content/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase opacity-40">
                Registered Users
              </p>
              <h3 className="text-4xl font-black italic">{users.length}</h3>
            </div>
            <FaUsersCog className="text-5xl opacity-10" />
          </div>
          <div className="p-8 rounded-[2rem] bg-base-content/5 border border-base-content/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase opacity-40">
                Total Contests
              </p>
              <h3 className="text-4xl font-black italic text-primary">
                {contests.length}
              </h3>
            </div>
            <FaTrophy className="text-5xl opacity-10" />
          </div>
        </div>

        {/* MANAGE USERS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <FaUsersCog className="text-2xl text-primary" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Personnel Management
            </h2>
          </div>

          <div className="overflow-x-auto rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl">
            <table className="table w-full">
              <thead>
                <tr
                  className="border-b border-base-content/10"
                  style={{ color: "var(--text-nav)" }}
                >
                  <th className="bg-transparent uppercase font-black italic">
                    Identity
                  </th>
                  <th className="bg-transparent uppercase font-black italic text-center">
                    Rank
                  </th>
                  <th className="bg-transparent uppercase font-black italic text-right">
                    Adjust Rank
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-base-content/5 hover:bg-base-content/5"
                  >
                    <td>
                      <p className="font-black uppercase italic">
                        {u.name || "Anonymous"}
                      </p>
                      <p className="text-[10px] opacity-50 font-bold">
                        {u.email}
                      </p>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge font-black italic text-[10px] py-3 px-4 rounded-lg ${
                          u.role === "Admin"
                            ? "badge-error"
                            : u.role === "Creator"
                            ? "badge-primary"
                            : "badge-ghost border-base-content/20"
                        }`}
                      >
                        {u.role || "User"}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => handleRoleChange(u._id, u.role, "User")}
                        className="btn btn-xs btn-square btn-ghost border-base-content/10 tooltip"
                        data-tip="User"
                      >
                        <FaUser />
                      </button>
                      <button
                        onClick={() =>
                          handleRoleChange(u._id, u.role, "Creator")
                        }
                        className="btn btn-xs btn-square btn-ghost border-base-content/10 tooltip text-primary"
                        data-tip="Creator"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => handleRoleChange(u._id, u.role, "Admin")}
                        className="btn btn-xs btn-square btn-ghost border-base-content/10 tooltip text-error"
                        data-tip="Admin"
                      >
                        <FaUserShield />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MANAGE CONTESTS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <FaTrophy className="text-2xl text-warning" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Contest Verification
            </h2>
          </div>

          <div className="overflow-x-auto rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl">
            <table className="table w-full">
              <thead>
                <tr
                  className="border-b border-base-content/10"
                  style={{ color: "var(--text-nav)" }}
                >
                  <th className="bg-transparent uppercase font-black italic">
                    Contest Details
                  </th>
                  <th className="bg-transparent uppercase font-black italic text-center">
                    Status
                  </th>
                  <th className="bg-transparent uppercase font-black italic text-right">
                    Operational Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contests.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-base-content/5 hover:bg-base-content/5"
                  >
                    <td>
                      <p className="font-black uppercase italic tracking-tighter">
                        {c.name}
                      </p>
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                        {c.creatorEmail}
                      </p>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge font-black italic text-[10px] py-3 px-4 rounded-lg ${
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
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {c.status !== "Confirmed" && (
                          <button
                            onClick={() =>
                              handleContestStatus(c._id, "Confirmed")
                            }
                            className="btn btn-sm btn-success rounded-xl font-black italic uppercase text-[10px]"
                          >
                            <FaCheck /> Confirm
                          </button>
                        )}
                        {c.status !== "Rejected" && (
                          <button
                            onClick={() =>
                              handleContestStatus(c._id, "Rejected")
                            }
                            className="btn btn-sm btn-warning rounded-xl font-black italic uppercase text-[10px]"
                          >
                            <FaTimes /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteContest(c._id)}
                          className="btn btn-sm btn-error btn-square rounded-xl"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
