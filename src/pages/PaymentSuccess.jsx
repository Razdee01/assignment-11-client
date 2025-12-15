// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    axios
      .post("http://localhost:3000/payment-success", { sessionId })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "You are now registered for the contest.",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Payment verification failed.",
        });
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md">
        {loading ? (
          <p className="text-lg font-medium">Verifying payment...</p>
        ) : (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>

            <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>

            <p className="text-gray-600 mb-6">
              Thank you for your payment. You have been successfully registered.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/all-contests"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                View Contests
              </Link>

              <Link
                to="/"
                className="border border-gray-300 hover:bg-gray-100 py-2 rounded-lg"
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
