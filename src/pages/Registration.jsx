import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../utilitis/axiosConfig";
import { auth } from "../firebase/firebase.config";

const Registration = () => {
  const { createUser, googleSignIn, updateUserProfile } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create Firebase user
      await createUser(data.email, data.password);

      let imgURL = "";

      // Upload image if provided
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

      // Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imgURL,
      });

      const firebaseUser = auth.currentUser;

      // Save to MongoDB
      await axios.post("http://localhost:3000/save-user", {
        uid: firebaseUser.uid,
        name: data.name,
        email: data.email,
        photo: imgURL,
      });

      // Generate JWT token
      const tokenRes = await axios.post(
        "http://localhost:3000/generate-token",
        {
          email: data.email,
        }
      );
      localStorage.setItem("token", tokenRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to ContestHub!",
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

      // Save Google user to DB
      await axios.post("http://localhost:3000/save-user", {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Unknown",
        email: firebaseUser.email,
        photo: firebaseUser.photoURL || "",
      });

      // Generate JWT token
      const tokenRes = await axios.post(
        "http://localhost:3000/generate-token",
        {
          email: firebaseUser.email,
        }
      );
      localStorage.setItem("token", tokenRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Registered with Google!",
        text: "Welcome!",
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="card bg-base-100 w-full max-w-lg shadow-2xl">
        <div className="card-body p-10">
          <h2 className="card-title text-4xl font-bold text-center mb-10">
            Create an Account
          </h2>

          {error && (
            <div className="alert alert-error shadow-lg mb-6">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className="input input-lg input-bordered w-full"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <input
                type="email"
                placeholder="Email Address"
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

            <div className="form-control">
              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                className="file-input file-input-bordered file-input-lg w-full"
              />
              <label className="label">
                <span className="label-text-alt">Upload photo (optional)</span>
              </label>
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full text-xl"
              >
                {loading ? "Creating Account..." : "Register"}
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
            {loading ? "Signing up..." : "Continue with Google"}
          </button>

          <p className="text-center mt-8 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-bold text-lg">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
