import React, { useState, useEffect, useContext } from "react";
import axios from "../utilitis/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import { AuthContext } from "../contexts/AuthContext";

export default function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [contest, setContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [winnerDeclared, setWinnerDeclared] = useState(false);

  // 1. REGISTRATION (STRIPE)
  const handleRegister = async () => {
    if (!user) {
      Swal.fire("Please Login", "You must be logged in to register", "warning");
      return navigate("/login");
    }

    try {
      const response = await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/create-checkout-session",
        {
          contestId: id,
          userEmail: user.email,
          userName: user.displayName,
          amount: contest.entryFee,
          contestName: contest.name,
          description: contest.description,
          bannerImage: contest.bannerImage,
          userId: user.uid || "",
          userPhoto: user.photoURL || "",
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Payment initiation failed",
        "error"
      );
    }
  };

  // 2. SUBMISSION HANDLER
  const handleSubmitTask = async () => {
    const { value: submissionLink } = await Swal.fire({
      title: "Submit Your Work",
      input: "url",
      inputLabel: "Provide your Project/Submission Link",
      inputPlaceholder: "https://github.com/...",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
    });

    if (submissionLink) {
      try {
        await axios.post(
          `https://assignment-11-server-five-flax.vercel.app/submissions`,
          {
            contestId: id,
            participantEmail: user.email,
            participantName: user.displayName,
            submissionLink: submissionLink,
            submittedAt: new Date(),
          }
        );
        setHasSubmitted(true);
        Swal.fire("Success", "Task submitted successfully!", "success");
      } catch (err) {
        Swal.fire("Error", "Could not submit task. Try again.", "error");
      }
    }
  };

  // 3. FETCH CONTEST DATA
  useEffect(() => {
    if (!id) return;
    const fetchContest = async () => {
      try {
        const { data } = await axios.get(
          `https://assignment-11-server-five-flax.vercel.app/contests/${id}`
        );
        setContest(data);
        const ended = new Date() > new Date(data.deadline);
        setIsEnded(ended || !!data.winner?.name);
        setWinnerDeclared(!!data.winner?.name);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  // 4. CHECK STATUS (Registered & Submitted)
  // FIXED: Added better dependency tracking to ensure buttons show up immediately
  useEffect(() => {
    if (!id || !user?.email) return;

    const checkStatus = async () => {
      try {
        const regRes = await axios.get(
          `https://assignment-11-server-five-flax.vercel.app/registrations/check`,
          { params: { contestId: id, email: user.email } }
        );
        setIsRegistered(regRes.data.registered);

        // Only check submission if they are actually registered
        if (regRes.data.registered) {
          const subRes = await axios.get(
            `https://assignment-11-server-five-flax.vercel.app/submissions/check`,
            { params: { contestId: id, email: user.email } }
          );
          setHasSubmitted(subRes.data.submitted);
        }
      } catch (error) {
        console.error("Status check failed", error);
      }
    };

    checkStatus();
  }, [id, user?.email]);

  // 5. COUNTDOWN TIMER
  useEffect(() => {
    if (!contest || isEnded) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(contest.deadline).getTime();
      const diff = deadline - now;
      if (diff <= 0) {
        setCountdown("Ended");
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
  }, [contest, isEnded]);

  if (isLoading) return <Loading />;

  return (
    <div
      className="min-h-screen py-10 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">
            {contest.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start items-center">
            <span className="badge badge-primary badge-lg font-black uppercase py-4 px-6">
              {contest.contentType}
            </span>
            <span
              className={`text-xl font-black italic ${
                isEnded ? "text-error" : "text-success"
              }`}
            >
              {isEnded ? "● Contest Ended" : `⏳ ${countdown}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <img
                src={contest.bannerImage}
                className="w-full h-96 object-cover rounded-[3rem] shadow-2xl border-4 border-base-content/10 transition-transform duration-500 group-hover:scale-[1.01]"
                alt="banner"
              />
              {isEnded && (
                <div className="absolute inset-0 bg-black/60 rounded-[3rem] flex items-center justify-center">
                  <h2 className="text-white text-5xl font-black uppercase italic border-4 border-white p-4">
                    Closed
                  </h2>
                </div>
              )}
            </div>

            <div className="p-10 rounded-[3rem] shadow-sm border border-base-content/10 bg-base-content/5">
              <h2 className="text-2xl font-black uppercase mb-4 text-primary italic">
                Description
              </h2>
              <p className="text-lg opacity-80 leading-relaxed mb-10">
                {contest.description}
              </p>

              <h2 className="text-2xl font-black uppercase mb-4 text-primary italic">
                Task Details
              </h2>
              <div className="bg-base-100/50 p-6 rounded-2xl border border-dashed border-primary/30">
                <p className="text-lg opacity-90 leading-relaxed">
                  {contest.taskDetails}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="stats stats-vertical shadow-2xl bg-primary text-primary-content w-full rounded-[2.5rem] overflow-hidden">
              <div className="stat p-8">
                <div className="stat-title text-primary-content/70 font-bold uppercase text-xs">
                  Entry Fee
                </div>
                <div className="stat-value text-5xl font-black italic">
                  ৳{contest.entryFee}
                </div>
              </div>
              <div className="stat p-8 border-t border-primary-content/10 bg-black/10">
                <div className="stat-title text-primary-content/70 font-bold uppercase text-xs">
                  Prize Pool
                </div>
                <div className="stat-value text-5xl font-black italic text-warning">
                  ৳{contest.prizeMoney}
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] text-center border border-base-content/10 bg-base-content/5 shadow-lg">
              <p className="text-xs font-bold opacity-50 uppercase mb-1">
                Current Participants
              </p>
              <p className="text-4xl font-black">{contest.participants || 0}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              {/* REGISTER BUTTON: Only show if NOT registered */}
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={isEnded || winnerDeclared}
                  className="btn btn-primary btn-lg rounded-2xl font-black uppercase italic h-20 text-xl shadow-lg transition-all hover:scale-105"
                >
                  {isEnded ? "Registration Closed" : "Register Now"}
                </button>
              ) : (
                <div className="alert alert-success rounded-2xl font-bold italic shadow-md">
                  <span>✓ You are Registered</span>
                </div>
              )}

              {/* SUBMIT BUTTON: Only show if REGISTERED */}
              {isRegistered && (
                <button
                  onClick={handleSubmitTask}
                  disabled={hasSubmitted || isEnded}
                  className={`btn btn-lg rounded-2xl font-black uppercase italic h-20 text-xl shadow-lg transition-all hover:scale-105 ${
                    hasSubmitted
                      ? "btn-ghost border-2 border-success"
                      : "btn-secondary"
                  }`}
                >
                  {hasSubmitted ? "✓ Task Submitted" : "Submit Task"}
                </button>
              )}

              {winnerDeclared && (
                <div className="p-6 bg-warning/20 border-2 border-warning rounded-2xl text-center animate-pulse">
                  <p className="font-black italic text-warning uppercase text-xl">
                    🏆 Winner Declared
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
