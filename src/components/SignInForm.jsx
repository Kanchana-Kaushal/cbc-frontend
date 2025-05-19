import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function SignInForm({ toggleAuth }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/sign-in",
        data,
      );

      toast.success("Login Successful");

      const user = JSON.stringify(response.data.data.user);
      localStorage.setItem("user", user);

      localStorage.setItem("token", response.data.data.token);

      console.log();

      if (response.data.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center rounded-b-xl bg-white p-8 inset-shadow-2xs md:w-1/2 md:rounded-r-2xl md:rounded-bl-none"
    >
      <h2 className="mb-6 text-3xl font-bold">Sign In</h2>

      {/* Email */}
      <label htmlFor="email" className="text-sm text-gray-900">
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
      <label htmlFor="password" className="mt-3 text-sm text-gray-900">
        Password:
      </label>
      <input
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
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

      <div className="mb-4 flex justify-end text-sm text-gray-800">
        <a href="#">Forgot Password?</a>
      </div>

      <button
        type="submit"
        className="mt-2 mb-3 w-full cursor-pointer rounded-md bg-gradient-to-r from-[#f8997d] to-[#ad336d] p-2 font-semibold text-white transition-transform duration-75 ease-in-out active:scale-99"
      >
        Sign In
      </button>

      <p className="text-center text-sm">
        New here?{" "}
        <span
          className="cursor-pointer font-semibold text-[#ad336d]"
          onClick={toggleAuth}
        >
          Create an account
        </span>
      </p>
    </form>
  );
}

export default SignInForm;
