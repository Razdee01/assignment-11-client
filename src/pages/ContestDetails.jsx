import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskText, setTaskText] = useState("");

  // Fetch contest
  useEffect(() => {
    axios.get(`http://localhost:3000/contests/${id}`).then((res) => {
      setContest(res.data);
      setLoading(false);
    });
  }, [id]);

  // Live countdown
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(contest.deadline);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  const handleRegister = () => {
    if (timeLeft === "Contest Ended") return;

    navigate(`/payment/${id}`);
  };

  const openTaskSubmit = () => {
    setShowModal(true);
  };

  const submitTask = () => {
    if (!taskText.trim()) {
      return Swal.fire({ icon: "error", title: "Task cannot be empty" });
    }

    Swal.fire({ icon: "success", title: "Task Submitted Successfully!" });
    setShowModal(false);
    setTaskText("");
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      <img
        src={contest.bannerImage}
        alt={contest.name}
        className="w-full h-72 object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-6">{contest.name}</h1>

      {/* Countdown */}
      <p className="text-lg mt-2 font-semibold text-red-600">⏳ {timeLeft}</p>

      <p className="mt-4 text-gray-700 leading-relaxed">
        {contest.description}
      </p>
      <p className="mt-4 text-gray-700 leading-relaxed font-semibold">
        Task: {contest.taskDetails}
      </p>

      <p className="text-xl mt-4 font-bold text-green-700">
        Prize: {contest.prizeMoney}
      </p>

      <p className="mt-2 text-lg font-medium">
        Participants:{" "}
        <span className="text-blue-600">{contest.participantsCount}</span>
      </p>

      {contest.winner && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <h3 className="font-bold text-xl">Winner</h3>
          <img
            src={contest.winner.photo}
            alt={contest.winner.name}
            className="w-24 h-24 rounded-full mt-3"
          />
          <p className="text-lg font-semibold mt-2">{contest.winner.name}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleRegister}
          disabled={timeLeft === "Contest Ended"}
          className={`px-6 py-3 rounded-lg text-white ${
            timeLeft === "Contest Ended" ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          Register / Pay
        </button>

        <button
          onClick={openTaskSubmit}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg"
        >
          Submit Task
        </button>
      </div>

      {/* Task Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-3">Submit Task</h3>

            <textarea
              className="border p-2 w-full h-32 rounded"
              placeholder="Enter task details or links..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitTask}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDetails;
