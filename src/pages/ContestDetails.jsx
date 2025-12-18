import React, { useState, useEffect, useContext } from "react";
import axios from "../utilitis/axiosConfig";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import { AuthContext } from "../contexts/AuthContext";

export default function ContestDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [contest, setContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [winnerDeclared, setWinnerDeclared] = useState(false);

  // ================= FETCH CONTEST =================
  useEffect(() => {
    if (!id) return;

    const fetchContest = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/contests/${id}`
        );
        setContest(data);
        const ended = new Date() > new Date(data.deadline);
        setIsEnded(ended || !!data.winner?.name);
        setWinnerDeclared(!!data.winner?.name);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not load contest", "error");
        setIsLoading(false);
      }
    };

    fetchContest();
  }, [id]);

  // ================= CHECK REGISTRATION =================
  useEffect(() => {
    if (!id || !user?.email) return;

    axios
      .get("http://localhost:3000/registrations/check", {
        params: { contestId: id, email: user.email },
      })
      .then((res) => setIsRegistered(res.data.registered))
      .catch(console.error);
  }, [id, user?.email]);

  // ================= CHECK SUBMISSION =================
  useEffect(() => {
    if (!id || !user?.email) return;

    axios
      .get("http://localhost:3000/submissions/check", {
        params: { contestId: id, email: user.email },
      })
      .then((res) => setHasSubmitted(res.data.submitted))
      .catch(console.error);
  }, [id, user?.email]);

  // ================= COUNTDOWN TIMER =================
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(contest.deadline).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setCountdown("Contest Ended");
        setIsEnded(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  // ================= HANDLE PAYMENT =================
  const handlePayment = async () => {
    if (isEnded || isRegistered || winnerDeclared) {
      return Swal.fire(
        "Can't register",
        "Contest ended or already registered",
        "info"
      );
    }

    try {
      const paymentData = {
        contestId: contest._id,
        contestName: contest.name,
        amount: Number(contest.entryFee) || 100, // force number
        bannerImage:
          contest.bannerImage || "https://via.placeholder.com/800x400",
        description: contest.description || "Contest entry",
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        userPhoto: user.photoURL || "",
      };

      console.log("Sending payment data:", paymentData); // ← ADD THIS

      const { data } = await axios.post(
        "http://localhost:3000/create-checkout-session",
        paymentData
      );

      window.location.href = data.url;
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      Swal.fire(
        "Payment Failed",
        err.response?.data?.message || "Try again",
        "error"
      );
    }
  };

  // ================= HANDLE TASK SUBMIT =================
  const handleTaskSubmit = async () => {
    if (isEnded)
      return Swal.fire(
        "Error",
        "Contest has ended, submissions closed",
        "error"
      );
    if (winnerDeclared)
      return Swal.fire("Info", "Winner already declared", "info");
    if (!isRegistered)
      return Swal.fire("Error", "You are not registered", "error");

    const { value: taskLink } = await Swal.fire({
      title: "Submit Your Task",
      input: "textarea",
      inputPlaceholder: "Paste your submission link",
      showCancelButton: true,
    });

    if (!taskLink) return;

    try {
      await axios.post("http://localhost:3000/submit-task", {
        contestId: id,
        userEmail: user.email,
        taskLink,
      });

      setHasSubmitted(true);
      Swal.fire("Success!", "Task submitted successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Submission failed",
        "error"
      );
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-11/12 mx-auto py-10">
      {/* Banner */}
      <img
        src={contest.bannerImage}
        alt={contest.name}
        className="w-full h-72 object-cover rounded-xl shadow"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold mt-6">{contest.name}</h1>

      {/* Countdown */}
      <p
        className={`text-xl font-semibold mt-2 ${
          isEnded ? "text-red-600" : "text-green-600"
        }`}
      >
        {isEnded ? "Contest Ended" : `⏳ Time Left: ${countdown}`}
      </p>

      {/* Stats */}
      <div className="mt-4 text-lg">
        <p>
          <strong>Participants:</strong> {contest.participants}
        </p>
        <p>
          <strong>Prize:</strong> {contest.prizeMoney} BDT
        </p>
      </div>

      {/* Description */}
      <div className="mt-6 bg-gray-100 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Description</h2>
        <p>{contest.description}</p>
      </div>

      {/* Task Details */}
      <div className="mt-6 bg-gray-100 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Task Details</h2>
        <p>{contest.taskDetails}</p>
      </div>

      {/* Winner */}
      <div className="mt-8 p-5 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Winner</h2>
        {contest.winner?.name ? (
          <div className="flex items-center gap-4">
            <img
              src={contest.winner.photo}
              alt="winner"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <p className="text-xl font-semibold">{contest.winner.name}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Winner not declared yet.</p>
        )}
      </div>

      {/* Register Button */}
      <button
        disabled={isEnded || isRegistered || winnerDeclared}
        onClick={handlePayment}
        className={`w-full mt-6 py-3 text-white rounded-xl text-lg font-semibold ${
          isEnded || isRegistered || winnerDeclared
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRegistered
          ? "Registered"
          : winnerDeclared
          ? "Winner Declared"
          : "Register"}
      </button>

      {/* Submit Task Button */}
      <button
        disabled={isEnded || !isRegistered || hasSubmitted || winnerDeclared}
        onClick={handleTaskSubmit}
        className={`w-full mt-4 py-3 text-white rounded-xl text-lg font-semibold ${
          isEnded || !isRegistered || hasSubmitted || winnerDeclared
            ? "bg-gray-400"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {hasSubmitted
          ? "Already Submitted"
          : winnerDeclared
          ? "Winner Declared"
          : "Submit Task"}
      </button>
    </div>
  );
}
