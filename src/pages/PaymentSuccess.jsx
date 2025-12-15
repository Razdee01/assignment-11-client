// frontend PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

 useEffect(() => {
   if (!sessionId) return;

   axios
     .post("http://localhost:3000/payment-success", { sessionId })
    
     .catch((err) => console.error(err));
 }, [sessionId]);


  return <div>Payment Success Page</div>;
};

export default PaymentSuccess;
