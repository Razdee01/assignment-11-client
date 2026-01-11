// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "../utilitis/axiosConfig";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    axios
      .post(
        "https://assignment-11-server-five-flax.vercel.app/payment-success",
        { sessionId }
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "You are now registered for the contest.",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--background-nav)",
          color: "var(--text-nav)",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Payment verification failed.",
          background: "var(--background-nav)",
          color: "var(--text-nav)",
        });
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="w-full max-w-md p-10 rounded-[2.5rem] border border-base-content/10 bg-base-content/5 shadow-2xl text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="text-xl font-black uppercase italic tracking-tighter">
              Verifying payment...
            </p>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 text-success text-5xl mb-6 shadow-inner">
              ✓
            </div>

            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
              Payment <span className="text-primary">Successful</span>
            </h1>

            <p className="opacity-70 font-medium mb-8">
              Thank you for your payment. Your entry has been recorded. You can
              now access the contest tasks.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                to="/all-contests"
                className="btn btn-primary rounded-2xl font-black uppercase italic text-lg h-14 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                View Contests
              </Link>

              <Link
                to="/"
                className="btn btn-outline border-base-content/20 rounded-2xl font-black uppercase italic text-lg h-14 hover:bg-base-content/10 transition-all"
                style={{ color: "var(--text-nav)" }}
              >
                Go to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
