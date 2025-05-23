import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadMedia } from "../../utils/supabase";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5"; // make sure this import exists

function CreateAdminPage() {
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    if (!avatar) {
      toast.error("Please select an avatar image");
      return;
    }

    try {
      const avatarUrl = await uploadMedia(avatar);

      const newAdmin = {
        username: data.username,
        avatar: avatarUrl,
        email: data.email,
        password: data.password,
      };

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/create-admin",
        newAdmin,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Admin created successfully!");
      navigate("/admin/admins");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to create admin account",
      );
    }
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 w-full max-w-2xl rounded-xl bg-white p-10 shadow-2xl"
    >
      <h1 className="mb-6 text-center text-2xl font-bold">Create New Admin</h1>

      {/* Avatar Upload and Preview */}
      <div className="mb-6 flex items-center gap-6">
        <label
          htmlFor="avatar"
          className="group relative mx-auto block h-30 w-30 cursor-pointer rounded-full ring-1 ring-gray-600 transition"
        >
          {avatar && (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar Preview"
              className="mx-auto h-full w-full rounded-full object-cover"
            />
          )}
          <IoAdd className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-4xl text-white opacity-0 group-hover:opacity-100" />
          <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-50"></div>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* Username Field */}
      <label>Username:</label>
      <input
        type="text"
        {...register("username", { required: "Username is required" })}
        className="mb-4 w-full rounded-lg p-2 ring-1 ring-gray-300"
        placeholder="John Doe"
      />
      {errors.username && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.username.message}
        </p>
      )}

      {/* Email Field */}
      <label>Email:</label>
      <input
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        className="mb-4 w-full rounded-lg p-2 ring-1 ring-gray-300"
        placeholder="admin@example.com"
      />
      {errors.email && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.email.message}
        </p>
      )}

      {/* Password Field */}
      <label>Password:</label>
      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        className="mb-4 w-full rounded-lg p-2 ring-1 ring-gray-300"
        placeholder="******"
      />
      {errors.password && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.password.message}
        </p>
      )}

      {/* Confirm Password Field */}
      <label>Confirm Password:</label>
      <input
        type="password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        className="mb-4 w-full rounded-lg p-2 ring-1 ring-gray-300"
        placeholder="******"
      />
      {errors.confirmPassword && (
        <p className="-mt-3 mb-4 text-sm text-red-500">
          {errors.confirmPassword.message}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700"
      >
        Create Admin
      </button>
    </form>
  );
}

export default CreateAdminPage;
