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

  useEffect(() => {
    if (!id || !user?.email) return;
    axios
      .get(
        `https://assignment-11-server-five-flax.vercel.app/registrations/check`,
        { params: { contestId: id, email: user.email } }
      )
      .then((res) => setIsRegistered(res.data.registered));
    axios
      .get(
        `https://assignment-11-server-five-flax.vercel.app/submissions/check`,
        { params: { contestId: id, email: user.email } }
      )
      .then((res) => setHasSubmitted(res.data.submitted));
  }, [id, user?.email]);

  useEffect(() => {
    if (!contest) return;
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
  }, [contest]);

  if (isLoading) return <Loading />;

  return (
    <div 
      className="min-h-screen py-10 transition-colors duration-300"
      /* This ensures the page background matches your dark nav */
      style={{ backgroundColor: "var(--background-nav)", color: "var(--text-nav)" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text-nav)" }}>
            {contest.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <span className="badge badge-primary badge-lg font-bold">{contest.contentType}</span>
            <span className={`text-xl font-bold italic ${isEnded ? 'text-error' : 'text-success'}`}>
              {isEnded ? "● Contest Ended" : `⏳ ${countdown}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <img 
              src={contest.bannerImage} 
              className="w-full h-96 object-cover rounded-[3rem] shadow-2xl border-4" 
              style={{ borderColor: "rgba(128,128,128,0.2)" }}
              alt="banner"
            />
            
            {/* FIXED THE WHITE BOX HERE */}
            <div 
              className="p-10 rounded-[3rem] shadow-sm border"
              style={{ 
                backgroundColor: "var(--background-nav)", // Matches Nav Background
                color: "var(--text-nav)",                // Matches Nav Text
                borderColor: "rgba(128, 128, 128, 0.2)"  // Subtle border
              }}
            >
              <h2 className="text-2xl font-black uppercase mb-4 text-primary">Description</h2>
              <p className="text-lg opacity-80 leading-relaxed">{contest.description}</p>
              
              <h2 className="text-2xl font-black uppercase mt-10 mb-4 text-primary">Task Details</h2>
              <p className="text-lg opacity-80 leading-relaxed">{contest.taskDetails}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="stats stats-vertical shadow-xl bg-primary text-primary-content w-full rounded-[2.5rem]">
              <div className="stat p-8">
                <div className="stat-title text-primary-content opacity-70 font-bold uppercase">Entry Fee</div>
                <div className="stat-value text-5xl font-black italic">{contest.entryFee} BDT</div>
              </div>
              <div className="stat p-8 border-t border-primary-content/20">
                <div className="stat-title text-primary-content opacity-70 font-bold uppercase">Prize Pool</div>
                <div className="stat-value text-5xl font-black italic">{contest.prizeMoney} BDT</div>
              </div>
            </div>

            {/* FIXED THE PARTICIPANTS BOX HERE */}
            <div 
              className="p-8 rounded-[2.5rem] text-center border shadow-lg"
              style={{ 
                backgroundColor: "var(--background-nav)", 
                borderColor: "rgba(128, 128, 128, 0.2)" 
              }}
            >
               <p className="text-sm font-bold opacity-50 uppercase mb-1">Current Participants</p>
               <p className="text-4xl font-black">{contest.participants}</p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                disabled={isEnded || isRegistered || winnerDeclared}
                className="btn btn-primary btn-lg rounded-2xl font-black uppercase italic h-20 text-xl"
              >
                {isRegistered ? "Registered" : "Register Now"}
              </button>
              
              {isRegistered && (
                <button
                  disabled={hasSubmitted || isEnded}
                  className="btn btn-secondary btn-lg rounded-2xl font-black uppercase italic h-20 text-xl"
                >
                  {hasSubmitted ? "Submitted" : "Submit Task"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );}