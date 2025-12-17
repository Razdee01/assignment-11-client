import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import DashBoardAdmin from "./DashBoardAdmin";

const DashBoard = () => {
  const { user } = useContext(AuthContext);
  // In your Creator Dashboard component (DashBoard.jsx), add this near the top

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/participates/${user.email}`
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Failed to load participants:", error);
        alert("Could not load participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [user?.email]);

  const createdContests = [
    {
      id: 1,
      name: "My Contest 1",
      status: "Pending",
      deadline: "2026-01-20",
      entryFee: 150,
      prizeMoney: 1000,
    },
    {
      id: 2,
      name: "My Contest 2",
      status: "Confirmed",
      deadline: "2026-02-15",
      entryFee: 200,
      prizeMoney: 2000,
    },
    {
      id: 3,
      name: "My Contest 3",
      status: "Rejected",
      deadline: "2026-03-10",
      entryFee: 100,
      prizeMoney: 500,
    },
  ];

 

  // Add Contest Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const deadline = watch("deadline");

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
        creatorEmail: user?.email || "unknown@example.com",
        deadline: data.deadline.toISOString(),
      };

      console.log("Creating contest:", payload);

      const response = await axios.post(
        "http://localhost:3000/api/contests",
        payload
      );

      alert(
        "Contest created successfully! 🎉 Status: Pending (waiting for admin approval)"
      );
      console.log("Response:", response.data);
      reset(); // Clear form after success
    } catch (error) {
      console.error("Error creating contest:", error);
      alert(
        "Error: " +
          (error.response?.data?.message || "Failed to create contest")
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Creator Dashboard Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {user?.displayName || user?.email || "Creator"}!
        </p>
      </div>

      {/* Add Contest Form */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Add New Contest</h2>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-8 rounded-xl shadow"
          >
            {/* Contest Name */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Contest Name</span>
              </label>
              <input
                {...register("name", { required: "Contest name is required" })}
                type="text"
                placeholder="e.g. Pixel Art Challenge"
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Banner Image URL */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Banner Image URL
                </span>
              </label>
              <input
                {...register("image", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^https:\/\//,
                    message: "Must be a valid HTTPS URL",
                  },
                })}
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="input input-bordered w-full"
              />
              {errors.image && (
                <p className="text-error text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows="4"
                placeholder="Explain your contest..."
                className="textarea textarea-bordered w-full"
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Entry Fee & Prize Money */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Entry Fee (৳)</span>
              </label>
              <input
                {...register("price", {
                  required: "Entry fee required",
                  min: { value: 100, message: "Minimum ৳100 (Stripe rule)" },
                })}
                type="number"
                placeholder="100"
                className="input input-bordered w-full"
              />
              {errors.price && (
                <p className="text-error text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Prize Money (৳)
                </span>
              </label>
              <input
                {...register("prizeMoney", {
                  required: "Prize money required",
                  min: { value: 100, message: "Must be ≥ ৳100" },
                })}
                type="number"
                placeholder="1000"
                className="input input-bordered w-full"
              />
              {errors.prizeMoney && (
                <p className="text-error text-sm mt-1">
                  {errors.prizeMoney.message}
                </p>
              )}
            </div>

            {/* Task Instruction */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Task Instruction
                </span>
              </label>
              <textarea
                {...register("taskInstruction", {
                  required: "Task instruction required",
                })}
                rows="4"
                placeholder="What should participants submit?"
                className="textarea textarea-bordered w-full"
              />
              {errors.taskInstruction && (
                <p className="text-error text-sm mt-1">
                  {errors.taskInstruction.message}
                </p>
              )}
            </div>

            {/* Contest Type */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Contest Type</span>
              </label>
              <select
                {...register("contestType", {
                  required: "Select a contest type",
                })}
                className="select select-bordered w-full"
              >
                <option value="">Choose type...</option>
                <option>Design</option>
                <option>Gaming</option>
                <option>Writing</option>
                <option>Photography</option>
                <option>Video</option>
                <option>Business Idea</option>
                <option>Other</option>
              </select>
              {errors.contestType && (
                <p className="text-error text-sm mt-1">
                  {errors.contestType.message}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Deadline</span>
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setValue("deadline", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                minDate={new Date()}
                placeholderText="Select date & time"
                className="input input-bordered w-full"
              />
              {!deadline && (
                <p className="text-error text-sm mt-1">Deadline is required</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="btn btn-primary btn-wide text-xl"
              >
                Create Contest
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* My Created Contests Table */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Created Contests
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Entry Fee</th>
                <th>Prize</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {createdContests.map((contest) => (
                <tr key={contest.id}>
                  <td className="font-medium">{contest.name}</td>
                  <td>৳{contest.entryFee}</td>
                  <td>৳{contest.prizeMoney}</td>
                  <td>{contest.deadline}</td>
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
                  <td>
                    {contest.status === "Pending" ? (
                      <span className="text-sm text-gray-500">
                        Waiting for approval
                      </span>
                    ) : (
                      <button className="btn btn-sm btn-secondary">
                        See Submissions
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Submitted Tasks Page */}
      {/* Submitted Tasks Page - Real Data */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Submitted Tasks & Participants
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No one has registered yet.</p>
            <p className="text-sm mt-2">
              Share your contest to get participants! 🚀
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Participant Name</th>
                  <th>Email</th>
                  <th>Submitted Task</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, index) => (
                  <tr key={index}>
                    <td className="font-medium">{p.contestName}</td>
                    <td>{p.userName || "N/A"}</td>
                    <td>{p.userEmail}</td>
                    <td>
                      {p.taskLink ? (
                        <a
                          href={p.taskLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary"
                        >
                          View Submission
                        </a>
                      ) : (
                        <span className="text-gray-500">Not submitted yet</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-success">
                        Declare Winner
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

export default DashBoard;
