import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";

const DashBoard = () => {
  const { user } = useContext(AuthContext);

  const [myContests, setMyContests] = useState([]);
  const [loadingContests, setLoadingContests] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [declaredWinners, setDeclaredWinners] = useState(new Set()); // Track declared winners locally

  // Fetch My Created Contests
  useEffect(() => {
    const fetchMyContests = async () => {
      if (!user?.email) return;
      try {
        setLoadingContests(true);
        const response = await axios.get(
          `http://localhost:3000/my-contests/${user.email}`
        );
        setMyContests(response.data);
      } catch (error) {
        console.error("Failed to load contests:", error);
        Swal.fire("Error", "Could not load your contests", "error");
      } finally {
        setLoadingContests(false);
      }
    };
    fetchMyContests();
  }, [user?.email]);

  // Fetch Participants
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!user?.email) return;
      try {
        setLoadingParticipants(true);
        const response = await axios.get(
          `http://localhost:3000/participates/${user.email}`
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Failed to load participants:", error);
        Swal.fire("Error", "Could not load participants", "error");
      } finally {
        setLoadingParticipants(false);
      }
    };
    fetchParticipants();
  }, [user?.email]);

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

      await axios.post("http://localhost:3000/api/contests", payload);

      Swal.fire({
        title: "Success!",
        text: "Contest created successfully! Status: Pending",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
      reset();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create contest",
        "error"
      );
    }
  };

  // Declare Winner
  const handleDeclareWinner = async (participant) => {
    const result = await Swal.fire({
      title: "Declare Winner?",
      text: `Declare ${
        participant.userName || participant.userEmail
      } as winner of "${participant.contestName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post("http://localhost:3000/api/contests/declare-winner", {
        contestId: participant.contestId,
        winnerName: participant.userName || "Unknown",
        winnerEmail: participant.userEmail,
        winnerPhoto: participant.userPhoto || "",
      });

      Swal.fire({
        title: "Winner Declared! 🏆",
        text: `${
          participant.userName || participant.userEmail
        } is now the winner!`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      // Mark this contest as having a winner
      setDeclaredWinners((prev) => new Set(prev).add(participant.contestId));

      // Refresh participants
      const response = await axios.get(
        `http://localhost:3000/participates/${user.email}`
      );
      setParticipants(response.data);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {user?.displayName || user?.email || "Creator"}!
        </p>
      </div>

      {/* Add Contest */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Add New Contest</h2>
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-8 rounded-xl shadow"
          >
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Contest Name</span>
              </label>
              <input
                {...register("name", { required: "Required" })}
                type="text"
                className="input input-bordered w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Banner Image URL
                </span>
              </label>
              <input
                {...register("image", {
                  required: "Required",
                  pattern: { value: /^https:\/\//, message: "HTTPS URL" },
                })}
                type="url"
                className="input input-bordered w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                {...register("description", { required: "Required" })}
                rows="4"
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Entry Fee (৳)</span>
              </label>
              <input
                {...register("price", {
                  required: "Required",
                  min: { value: 100, message: "Min ৳100" },
                })}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Prize Money (৳)
                </span>
              </label>
              <input
                {...register("prizeMoney", { required: "Required" })}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Task Instruction
                </span>
              </label>
              <textarea
                {...register("taskInstruction", { required: "Required" })}
                rows="4"
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Contest Type</span>
              </label>
              <select
                {...register("contestType", { required: "Required" })}
                className="select select-bordered w-full"
              >
                <option value="">Choose...</option>
                <option>Design</option>
                <option>Gaming</option>
                <option>Writing</option>
                <option>Photography</option>
                <option>Video</option>
                <option>Business Idea</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Deadline</span>
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setValue("deadline", date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="yyyy-MM-dd HH:mm"
                minDate={new Date()}
                className="input input-bordered w-full"
                placeholderText="Select date & time"
              />
            </div>
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

      {/* My Created Contests */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          My Created Contests
        </h2>
        {loadingContests ? (
          <Loading />
        ) : myContests.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No contests yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Entry Fee</th>
                  <th>Prize</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {myContests.map((c) => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.name}</td>
                    <td>৳{c.entryFee}</td>
                    <td>৳{c.prizeMoney}</td>
                    <td>{new Date(c.deadline).toLocaleDateString()}</td>
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
                    <td>{c.participants || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Participants & Declare Winner */}
      <section className="bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Submitted Tasks & Participants
        </h2>
        {loadingParticipants ? (
          <Loading />
        ) : participants.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No participants yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Task</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => {
                  const isWinnerDeclared = declaredWinners.has(p.contestId);

                  return (
                    <tr key={p.userEmail + p.contestId}>
                      <td className="font-medium">{p.contestName}</td>
                      <td>
                        {p.userName || "N/A"}
                       
                      </td>
                      <td>{p.userEmail}</td>
                      <td>
                        {p.taskLink ? (
                          <a
                            href={p.taskLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-500">Not submitted</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeclareWinner(p)}
                          disabled={isWinnerDeclared}
                          className={`btn btn-sm ${
                            isWinnerDeclared
                              ? "btn-outline btn-disabled"
                              : "btn-success"
                          }`}
                        >
                          {isWinnerDeclared
                            ? "Winner Declared ✓"
                            : "Declare Winner"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashBoard;
