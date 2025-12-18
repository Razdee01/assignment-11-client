import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";

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
      };

      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/api/contests",
        payload
      );

      Swal.fire("Success", "Contest created (Pending)", "success");
      reset();
      fetchMyContests();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleEditContest = (contest) => {
    if (contest.status !== "Pending") {
      return Swal.fire(
        "Not Allowed",
        "Only pending contests can be edited",
        "info"
      );
    }
    navigate(`/edit-contest/${contest._id}`);
  };

  const handleDeleteContest = async (contestId) => {
    const result = await Swal.fire({
      title: "Delete Contest?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `https://assignment-11-server-five-flax.vercel.app/creator/contests/${contestId}`
      );

      Swal.fire("Deleted!", "Contest removed permanently", "success");

      // Refresh list
      fetchMyContests();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete contest", "error");
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Creator Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.displayName || user?.email}
        </p>
      </div>

      {/* Add Contest */}
      <section className="bg-base-200 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Contest</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-6 rounded-xl"
        >
          <div>
            <label className="label">
              <span className="label-text font-semibold">Contest Name</span>
            </label>
            <input
              {...register("name", { required: "Contest name required" })}
              className="input input-bordered w-full"
              placeholder="Contest Name"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Banner Image URL</span>
            </label>
            <input
              {...register("image", {
                required: "Image URL required",
                pattern: { value: /^https:\/\//, message: "Must be HTTPS URL" },
              })}
              className="input input-bordered w-full"
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image && (
              <p className="text-error text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              {...register("description", { required: "Description required" })}
              className="textarea textarea-bordered w-full"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Entry Fee (৳)</span>
            </label>
            <input
              {...register("price", {
                required: "Entry fee required",
                validate: {
                  isNumber: (v) => !isNaN(v) || "Must be number",
                  min: (v) => Number(v) >= 100 || "Minimum ৳100",
                },
              })}
              type="number"
              min="100"
              className="input input-bordered w-full"
              placeholder="159"
            />
            {errors.price && (
              <p className="text-error text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Prize Money (৳)</span>
            </label>
            <input
              {...register("prizeMoney", {
                required: "Prize money required",
                validate: (v) =>
                  (!isNaN(v) && v > 0) || "Must be valid number > 0",
              })}
              type="number"
              className="input input-bordered w-full"
              placeholder="10000"
            />
            {errors.prizeMoney && (
              <p className="text-error text-sm mt-1">
                {errors.prizeMoney.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Task Instruction</span>
            </label>
            <textarea
              {...register("taskInstruction", {
                required: "Task instruction required",
              })}
              className="textarea textarea-bordered w-full"
              placeholder="Task Instruction"
            />
            {errors.taskInstruction && (
              <p className="text-error text-sm mt-1">
                {errors.taskInstruction.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Contest Type</span>
            </label>
            <select
              {...register("contestType", { required: "Select contest type" })}
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option>Logo Design</option>
              <option>Gaming</option>
              <option>Article Writing</option>
              <option>Business Idea</option>
              <option>Photography</option>
            </select>
            {errors.contestType && (
              <p className="text-error text-sm mt-1">
                {errors.contestType.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Deadline</span>
            </label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setValue("deadline", date)}
              showTimeSelect
              className="input input-bordered w-full"
              placeholderText="Select deadline"
            />
            {!deadline && (
              <p className="text-error text-sm mt-1">Deadline required</p>
            )}
          </div>

          <div className="md:col-span-2 text-center">
            <button type="submit" className="btn btn-primary btn-wide">
              Create Contest
            </button>
          </div>
        </form>
      </section>

      {/* My Contests */}
      <section className="bg-base-200 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">My Contests</h2>

        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Prize</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myContests.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>৳{c.prizeMoney}</td>
                <td>{c.status}</td>
                <td className="flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleEditContest(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteContest(c._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => navigate(`/see-submissions/${c._id}`)}
                  >
                    See Submissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
