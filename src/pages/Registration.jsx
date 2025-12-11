import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Registration = () => {
  const { createUser, googleSignIn, updateUserProfile } =
    useContext(AuthContext);
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

    const profileImg = data.photo[0];

    if (data.password.length < 6) {
      return setError("Password must be at least 6 characters!");
    }

    createUser(data.email, data.password)
      .then(() => {
      

        // Upload image
        const formData = new FormData();
        formData.append("image", profileImg);
        const imgbbApiKey = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host
        }`;

        

        return axios.post(imgbbApiKey, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .then((res) => {
        

        if (!res.data || !res.data.data || !res.data.data.display_url) {
          throw new Error("Image upload failed, no display URL");
        }

        const imgURL = res.data.data.display_url;

        const userProfile = {
          displayName: data.name,
          photoURL: imgURL,
        };

       

        return updateUserProfile(userProfile);
      })
      .then(() => {
      

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created.",
        });

        navigate("/");
      })
      .catch((err) => {
       
        setError(err.message || "Something went wrong");
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
          Google Sign-in
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
