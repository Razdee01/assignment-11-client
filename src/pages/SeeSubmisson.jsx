import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";

const SeeSubmissions = () => {
  const { contestId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD CONTEST =================
  const fetchContest = async () => {
    const res = await axios.get(`http://localhost:3000/contests/${contestId}`);
    setContest(res.data);
  };

  // ================= LOAD SUBMISSIONS =================
  const fetchSubmissions = async () => {
    const res = await axios.get(
      `http://localhost:3000/see-submissions/${contestId}`
    );
    setSubmissions(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchContest();
        await fetchSubmissions();
      } catch (err) {
        Swal.fire("Error", "Failed to load submissions", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contestId]);

  // ================= DECLARE WINNER =================
  const handleDeclareWinner = async (submission) => {
    if (contest?.winner) {
      return Swal.fire("Info", "Winner already declared", "info");
    }

    const confirm = await Swal.fire({
      title: "Declare Winner?",
      text: `Winner: ${submission.userEmail}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Declare",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.post("http://localhost:3000/api/contests/declare-winner", {
        contestId,
        winnerName: submission.userName || "Unknown",
        winnerEmail: submission.userEmail,
        winnerPhoto: submission.userPhoto || "",
      });

      Swal.fire("Winner Declared 🏆", "", "success");
      fetchContest(); // refresh winner state
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
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Submissions — {contest?.name}
      </h1>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-500">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Task</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, index) => (
                <tr key={s._id}>
                  <td>{index + 1}</td>
                  <td>{s.userName || "N/A"}</td>
                  <td>{s.userEmail}</td>
                  <td>
                    <a
                      href={s.taskLink}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-primary"
                    >
                      View Task
                    </a>
                  </td>
                  <td>
                    <button
                      disabled={!!contest?.winner}
                      onClick={() => handleDeclareWinner(s)}
                      className={`btn btn-sm ${
                        contest?.winner ? "btn-disabled" : "btn-success"
                      }`}
                    >
                      {contest?.winner ? "Winner Declared ✓" : "Declare Winner"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeeSubmissions;
