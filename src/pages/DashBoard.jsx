import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const DashboardDemo = () => {
  // Hardcoded demo data (kept from before)
  const {user}=useContext(AuthContext);
  const participatedContests = [
    {
      id: 3,
      name: "Contest C",
      paymentStatus: "Pending",
      deadline: "2026-02-10",
    },
    { id: 1, name: "Contest A", paymentStatus: "Paid", deadline: "2025-12-20" },
    { id: 2, name: "Contest B", paymentStatus: "Paid", deadline: "2026-01-15" },
  ];

  const winningContests = [
    {
      id: 1,
      name: "Contest X",
      prize: "$500",
      rank: "1st Place",
      dateWon: "2023-12-01",
    },
    {
      id: 2,
      name: "Contest Y",
      prize: "$200",
      rank: "2nd Place",
      dateWon: "2023-11-15",
    },
  ];

  const profileData = {
    name: "John Doe",
    photo: "https://via.placeholder.com/150",
    bio: "Passionate contestant",
    participated: 10,
    won: 3,
  };

  const createdContests = [
    { id: 1, name: "My Contest 1", status: "Pending", deadline: "2024-01-20" },
    {
      id: 2,
      name: "My Contest 2",
      status: "Confirmed",
      deadline: "2024-02-15",
    },
    { id: 3, name: "My Contest 3", status: "Rejected", deadline: "2024-03-10" },
  ];

  const submissions = [
    {
      id: 1,
      contestName: "My Contest 1",
      participant: "User A",
      email: "usera@example.com",
      task: "Submitted task link",
    },
    {
      id: 2,
      contestName: "My Contest 1",
      participant: "User B",
      email: "userb@example.com",
      task: "Submitted task link",
    },
  ];

  // Sort participated contests by upcoming deadline (earliest first)
  const sortedParticipated = [...participatedContests].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  // Form for Add Contest (hardcoded demo - no real submission)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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
        creatorEmail: user.email,
        deadline: data.deadline.toISOString(),
      };

      console.log("Sending:", payload);

      // ← CHANGE THIS LINE TO FULL URL (same as your working code)
      const response = await axios.post(
        "http://localhost:3000/api/contests",
        payload
      );

      alert("Contest created successfully! 🎉 Waiting for admin approval.");
      console.log("Success:", response.data);
    } catch (error) {
      if (error.response) {
        alert("Error: " + (error.response.data.message || "Server error"));
      } else {
        alert("Cannot connect to server. Is backend running on port 3000?");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-12">
      {/* User Dashboard Section */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-center">User Dashboard</h2>

        {/* My Participated Contests */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">My Participated Contests</h3>
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
                    <td>{contest.name}</td>
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
                    <td>{contest.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Winning Contests */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">My Winning Contests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {winningContests.map((win) => (
              <div key={win.id} className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <h4 className="card-title justify-center">{win.name}</h4>
                  <p className="text-2xl font-bold text-primary">{win.prize}</p>
                  <p>{win.rank}</p>
                  <p className="text-sm">Won on: {win.dateWon}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Profile */}
        <div>
          <h3 className="text-2xl font-bold mb-4">My Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
              <img
                src={profileData.photo}
                alt="Profile"
                className="w-40 h-40 rounded-full mb-4"
              />
              <div className="text-center">
                <h4 className="text-xl font-semibold">{profileData.name}</h4>
                <p className="italic">{profileData.bio}</p>
              </div>
            </div>
            <div>
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Win Rate</div>
                  <div className="stat-value">
                    {(
                      (profileData.won / profileData.participated) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                  <div className="stat-desc">
                    {profileData.won} wins out of {profileData.participated}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Dashboard Section - With Real Add Contest Form (hardcoded submit) */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Creator Dashboard - Add Contest
        </h2>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-base-100 p-8 rounded-xl shadow"
          >
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-lg">
                  Contest Name
                </span>
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

            {/* Image URL */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-lg">
                  Banner Image URL
                </span>
              </label>
              <input
                {...register("image", { required: "Image URL is required" })}
                type="url"
                placeholder="https://example.com/banner.jpg"
                className="input input-bordered w-full"
              />
              {errors.image && (
                <p className="text-error text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-lg">
                  Description
                </span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows="4"
                placeholder="Tell participants what the contest is about..."
                className="textarea textarea-bordered w-full"
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Entry Fee & Prize Money */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-lg">
                    Entry Fee ($)
                  </span>
                </label>
                <input
                  {...register("price", {
                    required: "Entry fee required",
                    min: { value: 0, message: "Must be >= 0" },
                  })}
                  type="number"
                  placeholder="10"
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
                  <span className="label-text font-semibold text-lg">
                    Prize Money ($)
                  </span>
                </label>
                <input
                  {...register("prizeMoney", {
                    required: "Prize money required",
                    min: { value: 1, message: "Must be > 0" },
                  })}
                  type="number"
                  placeholder="500"
                  className="input input-bordered w-full"
                />
                {errors.prizeMoney && (
                  <p className="text-error text-sm mt-1">
                    {errors.prizeMoney.message}
                  </p>
                )}
              </div>
            </div>

            {/* Task Instruction */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-lg">
                  Task Instruction
                </span>
              </label>
              <textarea
                {...register("taskInstruction", {
                  required: "Task instruction required",
                })}
                rows="5"
                placeholder="What should participants submit? File types, rules, etc."
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
                <span className="label-text font-semibold text-lg">
                  Contest Type
                </span>
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
                <span className="label-text font-semibold text-lg">
                  Deadline
                </span>
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setValue("deadline", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
                minDate={new Date()}
                placeholderText="Select deadline date and time"
                className="input input-bordered w-full"
                fixedHeight
              />
              {!deadline && (
                <p className="text-error text-sm mt-1">Deadline is required</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="btn btn-primary btn-wide text-xl"
              >
                Create Contest (Demo)
              </button>
            </div>
          </form>

          <div className="alert alert-info mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              This is a hardcoded demo page. When you click "Create Contest", it
              will show an alert with the form data in the console.
            </span>
          </div>
        </div>
      </section>

      {/* Other Creator & Admin sections kept minimal for space */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Other Sections (Demo)
        </h2>
        <p className="text-center text-lg">
          My Created Contests, Submitted Tasks, Admin panels, etc. are omitted
          here for brevity but can be added similarly.
        </p>
      </section>
    </div>
  );
};

export default DashboardDemo;
