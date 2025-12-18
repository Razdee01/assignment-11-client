import React, {  useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../loading/Loading";
import { useParams, useNavigate } from "react-router-dom";

const EditContest = () => {
 
  const { id } = useParams(); // contestId from URL
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const deadline = watch("deadline");

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/contests/${id}`);
        const c = res.data;

        setContest(c);

        // Pre-fill form
        setValue("name", c.name);
        setValue("image", c.bannerImage);
        setValue("description", c.description);
        setValue("price", c.entryFee);
        setValue("prizeMoney", c.prizeMoney);
        setValue("taskInstruction", c.taskDetails);
        setValue("contestType", c.contentType);
        setValue("deadline", new Date(c.deadline));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load contest", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id, setValue, navigate]);

  // Update contest
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        image: data.image,
        description: data.description,
        price: Number(data.price),
        prizeMoney: Number(data.prizeMoney),
        taskInstruction: data.taskInstruction,
        contestType: data.contestType,
        deadline: data.deadline.toISOString(),
      };

      await axios.patch(`http://localhost:3000/api/contests/${id}`, payload);

      Swal.fire("Success!", "Contest updated successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update",
        "error"
      );
    }
  };

  if (loading) return <Loading />;

  if (contest?.status !== "Pending") {
    return (
      <div className="container mx-auto p-10 text-center">
        <p className="text-xl text-gray-600">
          Only pending contests can be edited.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Edit Contest</h1>
        <p className="text-gray-600 mt-2">Update your contest details</p>
      </div>

      <section className="bg-base-200 p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-8 rounded-xl"
        >
          {/* Contest Name */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Contest Name</span>
            </label>
            <input
              {...register("name", { required: "Contest name is required" })}
              type="text"
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Banner Image URL */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Banner Image URL</span>
            </label>
            <input
              {...register("image", {
                required: "Image URL is required",
                pattern: { value: /^https:\/\//, message: "Must be HTTPS URL" },
              })}
              type="url"
              className="input input-bordered w-full"
            />
            {errors.image && (
              <p className="text-error text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows="4"
              className="textarea textarea-bordered w-full"
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Entry Fee & Prize Money */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Entry Fee (৳)</span>
            </label>
            <input
              {...register("price", {
                required: "Entry fee required",
                validate: (v) => Number(v) >= 100 || "Minimum ৳100",
              })}
              type="number"
              min="100"
              className="input input-bordered w-full"
            />
            {errors.price && (
              <p className="text-error text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Prize Money (৳)</span>
            </label>
            <input
              {...register("prizeMoney", { required: "Prize money required" })}
              type="number"
              className="input input-bordered w-full"
            />
            {errors.prizeMoney && (
              <p className="text-error text-sm mt-1">
                {errors.prizeMoney.message}
              </p>
            )}
          </div>

          {/* Task Instruction */}
          <div className="md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Task Instruction</span>
            </label>
            <textarea
              {...register("taskInstruction", {
                required: "Task instruction required",
              })}
              defaultValue={contest?.taskDetails || ""}
              rows="4"
              className="textarea textarea-bordered w-full"
            />
            {errors.taskInstruction && (
              <p className="text-error text-sm mt-1">
                {errors.taskInstruction.message}
              </p>
            )}
          </div>

          {/* Contest Type */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Contest Type</span>
            </label>
            <select
              {...register("contestType", { required: "Select contest type" })}
              defaultValue={contest?.contentType || ""} // ← This forces correct pre-fill
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select Type
              </option>
              <option>Logo Design</option>
              <option>Gaming</option>
              <option>Article Writing</option>
              <option>Business Idea</option>
              <option>Photography</option>
            </select>
            {errors.contestType && (
              <p className="text-error text-sm mt-1">
                {errors.contestType.message}
              </p>
            )}
          </div>
          {/* Deadline */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Deadline</span>
            </label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setValue("deadline", date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={new Date()}
              className="input input-bordered w-full"
              placeholderText="Select date & time"
            />
            {!deadline && (
              <p className="text-error text-sm mt-1">Deadline required</p>
            )}
          </div>

          {/* Update Button */}
          <div className="md:col-span-2 text-center">
            <button type="submit" className="btn btn-primary btn-wide text-xl">
              Update Contest
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditContest;
