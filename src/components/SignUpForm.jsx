import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

function SignUpForm({ toggleAuth, loginFromGoogle }) {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    navigate("/auth/verify", { state: { data } });
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center rounded-b-xl bg-white p-8 inset-shadow-2xs md:w-1/2 md:rounded-r-2xl md:rounded-bl-none"
    >
      <h2 className="mb-6 text-3xl font-bold">Sign Up</h2>

      {/* Username */}
      <label htmlFor="username" className="text-sm text-gray-800">
        Username:
      </label>
      <input
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 2,
            message: "Too short",
          },
          maxLength: {
            value: 20,
            message: "Too long",
          },
        })}
        type="text"
        placeholder="John"
        name="username"
        className="mb-1 w-full rounded-md p-2 ring-1 ring-gray-400"
        autoComplete="off"
      />
      {errors.username && (
        <p role="alert" className="text-sm text-red-600">
          {errors.username.message}
        </p>
      )}

      {/* Email */}
      <label htmlFor="email" className="mt-3 text-sm text-gray-800">
        Email:
      </label>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address",
          },
        })}
        type="text"
        placeholder="example@email.com"
        name="email"
        className="mb-1 w-full rounded-md p-2 ring-1 ring-gray-400"
        autoComplete="off"
      />
      {errors.email && (
        <p role="alert" className="text-sm text-red-600">
          {errors.email.message}
        </p>
      )}

      {/* Password */}
      <label htmlFor="password" className="mt-3 text-sm text-gray-800">
        Password:
      </label>
      <input
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password is too short",
          },
          maxLength: {
            value: 16,
            message: "Password is too long",
          },
        })}
        type="password"
        placeholder="Securepass@123"
        name="password"
        className="mb-1 w-full rounded-md p-2 ring-1 ring-gray-400"
      />
      {errors.password && (
        <p role="alert" className="text-sm text-red-600">
          {errors.password.message}
        </p>
      )}

      {/* Confirm Password */}
      <label htmlFor="confirmPassword" className="mt-3 text-sm text-gray-800">
        Confirm Password:
      </label>
      <input
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        type="password"
        placeholder="Securepass@123"
        name="confirmPassword"
        className="mb-1 w-full rounded-md p-2 ring-1 ring-gray-400"
      />
      {errors.confirmPassword && (
        <p role="alert" className="text-sm text-red-600">
          {errors.confirmPassword.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 mb-3 w-full cursor-pointer rounded-md bg-gradient-to-r from-[#f8997d] to-[#ad336d] p-2 font-semibold text-white transition-transform duration-75 ease-in-out active:scale-99"
      >
        Sign Up
      </button>

      <button
        className="ring-accent text-accent hover:bg-accent mt-2 mb-3 flex w-full cursor-pointer items-center justify-center gap-4 rounded-md p-2 text-sm font-semibold ring-1 transition duration-75 ease-in-out hover:text-white active:scale-99"
        type="button"
        onClick={loginFromGoogle}
      >
        <FaGoogle />
        <span>Continue with Google</span>
      </button>

      {/* Toggle to Sign In */}
      <p className="text-center text-sm">
        Already a member?
        <span
          className="ml-2 cursor-pointer font-semibold text-[#ad336d]"
          onClick={toggleAuth}
        >
          Sign in here
        </span>
      </p>
    </form>
  );
}

export default SignUpForm;
