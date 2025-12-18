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
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Save/update user in MongoDB
      await axios.post("http://localhost:3000/save-user", {
        uid: result.user.uid,
        name: result.user.displayName || "Unknown",
        email: result.user.email,
        photo: result.user.photoURL || "",
      });

      Swal.fire({ icon: "success", title: "Login Successful!" });
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

      // Save Google user to DB
      await axios.post("http://localhost:3000/save-user", {
        uid: result.user.uid,
        name: result.user.displayName || "Unknown",
        email: result.user.email,
        photo: result.user.photoURL || "",
      });

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
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="card bg-base-100 w-full max-w-lg shadow-2xl">
        <div className="card-body p-10">
          <h2 className="card-title text-4xl font-bold text-center mb-10">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="input input-lg input-bordered w-full"
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="input input-lg input-bordered w-full"
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full text-xl"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="divider my-8 text-lg">OR</div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-outline btn-lg w-full text-lg"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3"
            >
              <path
                fill="#4285F4"
                d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              />
              <path
                fill="#34A853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              />
              <path
                fill="#FBBC02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              />
              <path
                fill="#EA4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              />
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="text-center mt-8 text-lg">
            Don’t have an account?{" "}
            <Link
              to="/registration"
              className="link link-primary font-bold text-lg"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
