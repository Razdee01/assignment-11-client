import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuthProvider, } from "firebase/auth";

import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

const Registration = () => {
    const { createUser, googleSignIn } = useContext(AuthContext);
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
    createUser(data.email, data.password)
    .then(() => {
    
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created.",
      });
      navigate("/");
    })
    .catch((err) => {
      setError(err.message);
    });

   
  };

  const handleGoogle = async () => {
    try {
     
      await googleSignIn();
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
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl">
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
          className="btn bg-white text-black border-[#e5e5e5] w-full"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Sign in with Google
        </button>
      </div>
      <p className="text-center mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Registration;
