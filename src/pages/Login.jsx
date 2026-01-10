import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../utilitis/axiosConfig";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"; // Install react-icons

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Quick fill credentials
  const fillCredentials = (email, password) => {
    setValue("email", email);
    setValue("password", password);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = result.user;

      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/save-user",
        {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Unknown",
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || "",
        }
      );

      const tokenRes = await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/generate-token",
        {
          email: firebaseUser.email,
        }
      );

      localStorage.setItem("token", tokenRes.data.token);
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      navigate(location.state || "/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login Failed", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/save-user",
        {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Unknown",
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || "",
        }
      );

      const tokenRes = await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/generate-token",
        {
          email: firebaseUser.email,
        }
      );

      localStorage.setItem("token", tokenRes.data.token);
      Swal.fire({ icon: "success", title: "Logged in with Google!" });
      navigate(location.state || "/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-[3rem] shadow-2xl border transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderColor: "rgba(128, 128, 128, 0.2)",
        }}
      >
        <div className="p-10 md:p-14">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-center mb-6">
            Login <span className="text-primary">Now</span>
          </h2>

          {/* DEMO CREDENTIAL BUTTONS */}
          <div className="flex gap-2 mb-8 justify-center">
            <button
              onClick={() => fillCredentials("user@example.com", "123456")}
              className="btn btn-xs btn-outline rounded-full opacity-70 hover:opacity-100"
            >
              Demo User
            </button>
            <button
              onClick={() => fillCredentials("admin@example.com", "admin123")}
              className="btn btn-xs btn-outline btn-secondary rounded-full opacity-70 hover:opacity-100"
            >
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-control">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                {...register("email", { required: "Email is required" })}
                className="input input-bordered w-full rounded-2xl bg-transparent border-base-content/20 focus:border-primary font-bold"
              />
            </div>

            <div className="form-control relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                {...register("password", { required: "Password is required" })}
                className="input input-bordered w-full rounded-2xl bg-transparent border-base-content/20 focus:border-primary font-bold pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full rounded-2xl font-black uppercase italic tracking-tighter text-xl h-16 shadow-lg shadow-primary/20"
            >
              {loading ? "Authenticating..." : "Login to Hub"}
            </button>
          </form>

          <div className="divider my-8 opacity-20 font-bold text-[10px] tracking-[0.2em]">
            OR CONTINUE WITH
          </div>

          {/* HIGH VISIBILITY GOOGLE BUTTON */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-lg w-full rounded-2xl font-black uppercase italic tracking-tighter border-none bg-white text-black hover:bg-gray-200 shadow-xl transition-all active:scale-95"
          >
            <FaGoogle className="text-2xl mr-3 text-red-500" />
            Sign in with Google
          </button>

          <p className="text-center mt-10 font-bold uppercase tracking-widest text-[10px] opacity-60">
            Need an account?{" "}
            <Link
              to="/registration"
              className="text-primary underline hover:text-secondary"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
