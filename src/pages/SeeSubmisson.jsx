import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import {
  FaTrophy,
  FaExternalLinkAlt,
  FaUserCircle,
  FaMedal,
} from "react-icons/fa";

const SeeSubmissions = () => {
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContest = async () => {
    const res = await axios.get(
      `https://assignment-11-server-five-flax.vercel.app/contests/${contestId}`
    );
    setContest(res.data);
  };

  const fetchSubmissions = async () => {
    const res = await axios.get(
      `https://assignment-11-server-five-flax.vercel.app/see-submissions/${contestId}`
    );
    setSubmissions(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchContest(), fetchSubmissions()]);
      } catch (err) {
        Swal.fire("Error", "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contestId]);

  const handleDeclareWinner = async (submission) => {
    if (contest?.winner) {
      return Swal.fire(
        "Decision Made",
        "A winner has already been crowned for this contest.",
        "info"
      );
    }

    const confirm = await Swal.fire({
      title: "Confirm Winner?",
      text: `Promote ${
        submission.userName || submission.userEmail
      } to winner status?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm Champion",
      background: "var(--background-nav)",
      color: "var(--text-nav)",
      confirmButtonColor: "#ffd700", // Gold color
    });

    if (!confirm.isConfirmed) return;

    try {
      // Fixed: changed http to https
      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/api/contests/declare-winner",
        {
          contestId,
          winnerName: submission.userName || "Unknown",
          winnerEmail: submission.userEmail,
          winnerPhoto: submission.userPhoto || "",
        }
      );

      Swal.fire({
        title: "Victory!",
        text: "The winner has been officially recorded.",
        icon: "success",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      fetchContest();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to declare winner",
        "error"
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen py-20 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary opacity-70">
            Review Submissions
          </h2>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            {contest?.name}
          </h1>
          {contest?.winnerEmail && (
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <FaTrophy className="text-yellow-500" />
              <span className="text-sm font-black italic uppercase text-yellow-500">
                Champion: {contest.winnerName}
              </span>
            </div>
          )}
        </div>

        {/* Submissions Table */}
        <div className="bg-base-content/5 border border-base-content/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {submissions.length === 0 ? (
            <div className="p-20 text-center space-y-4 opacity-30">
              <FaUserCircle className="text-6xl mx-auto" />
              <p className="font-black italic uppercase tracking-widest">
                No participants yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="border-b border-base-content/10">
                    <th className="bg-transparent uppercase font-black italic opacity-50">
                      Rank
                    </th>
                    <th className="bg-transparent uppercase font-black italic opacity-50">
                      Participant
                    </th>
                    <th className="bg-transparent uppercase font-black italic opacity-50 text-center">
                      Submission
                    </th>
                    <th className="bg-transparent uppercase font-black italic opacity-50 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, index) => {
                    const isWinner = contest?.winnerEmail === s.userEmail;
                    return (
                      <tr
                        key={s._id}
                        className={`border-b border-base-content/5 transition-colors ${
                          isWinner
                            ? "bg-yellow-500/5"
                            : "hover:bg-base-content/5"
                        }`}
                      >
                        <td className="font-black italic opacity-30 text-xl">
                          #{index + 1}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full border border-primary/20">
                                <img
                                  src={
                                    s.userPhoto ||
                                    "https://i.ibb.co/mR79Y6B/user.png"
                                  }
                                  alt="User"
                                />
                              </div>
                            </div>
                            <div>
                              <p className="font-black uppercase italic text-sm">
                                {s.userName || "Secret Agent"}
                              </p>
                              <p className="text-[10px] opacity-50 font-bold">
                                {s.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <a
                            href={s.taskLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-ghost gap-2 rounded-xl border border-base-content/10 group"
                          >
                            <FaExternalLinkAlt className="text-xs group-hover:text-primary transition-colors" />
                            <span className="font-black italic uppercase text-[10px]">
                              View Link
                            </span>
                          </a>
                        </td>
                        <td className="text-right">
                          {isWinner ? (
                            <div className="flex items-center justify-end gap-2 text-yellow-500 font-black italic uppercase text-xs">
                              <FaMedal className="text-lg" /> Champion
                            </div>
                          ) : (
                            <button
                              disabled={!!contest?.winnerEmail}
                              onClick={() => handleDeclareWinner(s)}
                              className={`btn btn-sm rounded-xl font-black italic uppercase text-[10px] tracking-widest ${
                                contest?.winnerEmail
                                  ? "btn-disabled opacity-20"
                                  : "btn-primary"
                              }`}
                            >
                              Declare Winner
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeeSubmissions;
