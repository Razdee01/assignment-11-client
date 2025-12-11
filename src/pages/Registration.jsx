import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const Registration = () => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const onSubmit = (data) => {
    setError("");
    setSuccess("");

    if (data.password.length < 6) {
      return setError("Password must be at least 6 characters!");
    }

    Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "Your account has been created.",
    });;
    navigate("/");
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created.",
      });
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full rounded mb-3"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 w-full rounded mb-3"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-3"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full rounded mb-3"
          {...register("photo")}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleGoogle}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Registration;
