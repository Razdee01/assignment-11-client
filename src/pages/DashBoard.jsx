import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  FaPlusCircle,
  FaLayerGroup,
  FaEdit,
  FaTrash,
  FaEye,
  FaAward,
  FaCalendarAlt,
  FaChartPie,
} from "react-icons/fa";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myContests, setMyContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const deadline = watch("deadline");

  // 1. Prepare Data for Chart (Status Distribution)
  const prepareChartData = () => {
    const statusCounts = myContests.reduce((acc, c) => {
      const status = c.status || "Pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  const chartData = prepareChartData();
  const COLORS = {
    Confirmed: "#10B981", // Success Green
    Pending: "#F59E0B", // Warning Amber
    Rejected: "#EF4444", // Error Red
  };

  const fetchMyContests = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://assignment-11-server-five-flax.vercel.app/my-contests/${user.email}`
      );
      setMyContests(res.data);
    } catch {
      Swal.fire("Error", "Could not load contests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyContests();
  }, [user?.email]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        image: data.image,
        description: data.description,
        price: Number(data.price),
        prizeMoney: Number(data.prizeMoney),
        taskInstruction: data.taskInstruction,
        contestType: data.contestType,
        creatorEmail: user.email,
        deadline: data.deadline.toISOString(),
        status: "Pending",
      };

      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/api/contests",
        payload
      );
      Swal.fire({
        title: "Launched!",
        text: "Your contest is now awaiting admin approval.",
        icon: "success",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      reset();
      fetchMyContests();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleEditContest = (contest) => {
    if (contest.status !== "Pending") {
      return Swal.fire("Locked", "Only pending contests can be edited", "info");
    }
    navigate(`/edit-contest/${contest._id}`);
  };

  const handleDeleteContest = async (contestId) => {
    const result = await Swal.fire({
      title: "Delete Contest?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(
        `https://assignment-11-server-five-flax.vercel.app/creator/contests/${contestId}`
      );
      Swal.fire("Deleted!", "Contest removed.", "success");
      fetchMyContests();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen py-12 px-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Creator <span className="text-primary">Studio</span>
          </h1>
          <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Managing: {user?.displayName || user?.email}
          </p>
        </header>

        {/* TOP SECTION: ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-[2rem] bg-base-content/5 border border-base-content/10">
              <p className="text-[10px] font-black uppercase opacity-40">
                Total Contests
              </p>
              <h3 className="text-4xl font-black italic">
                {myContests.length}
              </h3>
            </div>
            <div className="p-6 rounded-[2rem] bg-base-content/5 border border-base-content/10">
              <p className="text-[10px] font-black uppercase opacity-40">
                Live Contests
              </p>
              <h3 className="text-4xl font-black italic text-success">
                {myContests.filter((c) => c.status === "Confirmed").length}
              </h3>
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="lg:col-span-2 p-6 rounded-[2.5rem] bg-base-content/5 border border-base-content/10 flex flex-col items-center">
            <div className="w-full flex items-center gap-2 mb-2 px-4">
              <FaChartPie className="text-primary" />
              <h2 className="text-xs font-black uppercase italic">
                Contest Status Overview
              </h2>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ADD CONTEST FORM */}
          <section className="lg:col-span-5 p-8 rounded-[2.5rem] bg-base-content/5 border border-base-content/10 shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
              <FaPlusCircle className="text-primary" /> Create New
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <input
                  {...register("name", { required: "Required" })}
                  className="input input-bordered rounded-xl bg-transparent font-bold border-base-content/10"
                  placeholder="Contest Name"
                />
                {errors.name && (
                  <span className="text-error text-[10px] font-bold mt-1 uppercase">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <input
                  {...register("image", { required: "Required" })}
                  className="input input-bordered rounded-xl bg-transparent font-bold border-base-content/10"
                  placeholder="Banner Image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  {...register("price", { required: true, min: 100 })}
                  className="input input-bordered rounded-xl bg-transparent font-bold border-base-content/10"
                  placeholder="Entry Fee (৳)"
                />
                <input
                  type="number"
                  {...register("prizeMoney", { required: true })}
                  className="input input-bordered rounded-xl bg-transparent font-bold border-base-content/10"
                  placeholder="Prize (৳)"
                />
              </div>

              <select
                {...register("contestType", { required: true })}
                className="select select-bordered rounded-xl bg-transparent font-bold border-base-content/10 w-full"
              >
                <option value="" disabled selected>
                  Contest Category
                </option>
                <option>Logo Design</option>
                <option>Gaming</option>
                <option>Article Writing</option>
                <option>Business Idea</option>
                <option>Photography</option>
              </select>

              <div className="form-control relative">
                <FaCalendarAlt className="absolute right-4 top-4 opacity-30" />
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setValue("deadline", date)}
                  showTimeSelect
                  className="input input-bordered w-full rounded-xl bg-transparent font-bold border-base-content/10"
                  placeholderText="Set Deadline"
                />
              </div>

              <textarea
                {...register("description", { required: true })}
                className="textarea textarea-bordered w-full rounded-xl bg-transparent font-bold border-base-content/10"
                placeholder="Contest Description"
                rows="2"
              />
              <textarea
                {...register("taskInstruction", { required: true })}
                className="textarea textarea-bordered w-full rounded-xl bg-transparent font-bold border-base-content/10"
                placeholder="Submission Instructions"
                rows="2"
              />

              <button className="btn btn-primary w-full rounded-xl uppercase font-black italic tracking-widest mt-4">
                Launch Contest
              </button>
            </form>
          </section>

          {/* RIGHT: LIST OF CONTESTS */}
          <section className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-black uppercase italic px-4 flex items-center gap-3">
              <FaLayerGroup className="text-primary" /> My Portfolio
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {myContests.length === 0 ? (
                <div className="p-20 text-center opacity-20 font-black italic uppercase border-2 border-dashed border-base-content/10 rounded-[2.5rem]">
                  No Contests Created
                </div>
              ) : (
                myContests.map((c) => (
                  <div
                    key={c._id}
                    className="p-6 rounded-[2rem] bg-base-content/5 border border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary italic">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black uppercase italic tracking-tighter">
                          {c.name}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-bold opacity-50 flex items-center gap-1 uppercase">
                            <FaAward className="text-primary" /> ৳{c.prizeMoney}
                          </span>
                          <span
                            className={`badge badge-xs font-black text-[8px] uppercase p-2 ${
                              c.status === "Confirmed"
                                ? "badge-success"
                                : c.status === "Rejected"
                                ? "badge-error"
                                : "badge-warning"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditContest(c)}
                        className="btn btn-square btn-ghost btn-sm border border-base-content/10 hover:bg-info hover:text-white tooltip"
                        data-tip="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => navigate(`/see-submissions/${c._id}`)}
                        className="btn btn-square btn-ghost btn-sm border border-base-content/10 hover:bg-primary hover:text-white tooltip"
                        data-tip="Submissions"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteContest(c._id)}
                        className="btn btn-square btn-ghost btn-sm border border-base-content/10 hover:bg-error hover:text-white tooltip"
                        data-tip="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
