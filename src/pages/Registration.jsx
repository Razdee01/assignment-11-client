import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../utilitis/axiosConfig";
import { auth } from "../firebase/firebase.config";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

const Registration = () => {
  const { createUser, googleSignIn, updateUserProfile } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // --- Logic Section ---
  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Firebase User
      await createUser(data.email, data.password);

      let imgURL = "";

      // 2. Handle Image Upload to ImgBB
      if (data.photo && data.photo[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imgbbApiKey = import.meta.env.VITE_image_host;
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData
        );

        if (!res.data?.data?.display_url) {
          throw new Error("Image upload failed");
        }
        imgURL = res.data.data.display_url;
      }

      // 3. Update Firebase Profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imgURL,
      });

      const firebaseUser = auth.currentUser;

      // 4. Save User to MongoDB
      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/save-user",
        {
          uid: firebaseUser.uid,
          name: data.name,
          email: data.email,
          photo: imgURL,
          role: "user", // Default role
        }
      );

      // 5. Generate JWT Token
      const tokenRes = await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/generate-token",
        {
          email: data.email,
        }
      );
      localStorage.setItem("token", tokenRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome to ContestHub, ${data.name}!`,
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await googleSignIn();
      const firebaseUser = result.user;

      await axios.post(
        "https://assignment-11-server-five-flax.vercel.app/save-user",
        {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Unknown",
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || "",
          role: "user",
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
        title: "Registered with Google!",
        background: "var(--background-nav)",
        color: "var(--text-nav)",
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Section ---
  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 px-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-[3.5rem] shadow-2xl border transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderColor: "rgba(128, 128, 128, 0.2)",
        }}
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
              Create <span className="text-primary">Account</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mt-2">
              Join the competition elite
            </p>
          </div>

          {error && (
            <div className="alert alert-error rounded-2xl mb-6 py-3 text-sm font-bold flex justify-center">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type="text"
                  placeholder="FULL NAME"
                  {...register("name", { required: "Name is required" })}
                  className="input input-bordered w-full rounded-2xl bg-base-content/5 border-base-content/10 focus:border-primary font-bold pl-12 h-14"
                />
              </div>
              {errors.name && (
                <span className="text-error text-[10px] font-bold mt-1 ml-2">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  {...register("email", { required: "Email is required" })}
                  className="input input-bordered w-full rounded-2xl bg-base-content/5 border-base-content/10 focus:border-primary font-bold pl-12 h-14"
                />
              </div>
              {errors.email && (
                <span className="text-error text-[10px] font-bold mt-1 ml-2">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div className="form-control">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="input input-bordered w-full rounded-2xl bg-base-content/5 border-base-content/10 focus:border-primary font-bold px-12 h-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-primary transition-transform active:scale-90"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-[10px] font-bold mt-1 ml-2">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Photo Upload Area - Visual Fix */}
            <div className="form-control mt-2">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-base-content/20 rounded-2xl cursor-pointer bg-base-content/5 hover:bg-primary/5 hover:border-primary/50 transition-all group">
                <div className="flex flex-col items-center justify-center">
                  <FaCamera className="text-2xl text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Upload Profile Photo
                  </p>
                  <p className="text-[8px] opacity-40 uppercase mt-1 italic">
                    (Optional)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full rounded-2xl font-black uppercase italic tracking-tighter text-xl h-16 shadow-xl shadow-primary/20 mt-4"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>

          <div className="divider my-8 opacity-20 font-bold text-[10px] tracking-[0.3em]">
            OR SIGNUP WITH
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-lg w-full rounded-2xl font-black uppercase italic tracking-tighter border-none bg-white text-black hover:bg-gray-200 shadow-xl transition-all"
          >
            <FaGoogle className="text-xl mr-3 text-red-500" />
            Google Account
          </button>

          <p className="text-center mt-10 font-bold uppercase tracking-widest text-[10px] opacity-60">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-primary underline hover:text-secondary ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
