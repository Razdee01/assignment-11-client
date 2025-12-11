import React from "react";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

 const Login=()=> {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      Swal.fire({ icon: "success", title: "Login Successful!" });
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login Failed", text: err.message });
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Logged in with Google!" });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message,
      });
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Login to Your Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded mb-2"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 mb-2">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-2"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mb-2"
        >
          Login
        </button>
      </form>

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

      <p className="text-center">
        Don’t have an account?{" "}
        <Link to="/registration" className="text-blue-500 font-semibold">
          Register
        </Link>
      </p>
    </div>
  );
}
export default Login;
