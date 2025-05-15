import { useForm } from "react-hook-form";

function SignUpForm(props) {
  const toggleAuth = props.toggleAuth;

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center rounded-b-xl bg-white p-8 inset-shadow-2xs md:w-1/2 md:rounded-r-2xl md:rounded-bl-none"
    >
      <h2 className="mb-6 text-3xl font-bold">Sign Up</h2>

      {/* Username */}
      <label htmlFor="username">Username:</label>
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
        <p role="alert" className="mb-3 text-sm text-red-600">
          {errors.username.message}
        </p>
      )}

      {/* Email */}
      <label htmlFor="email">Email:</label>
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
        <p role="alert" className="mb-3 text-sm text-red-600">
          {errors.email.message}
        </p>
      )}

      {/* Password */}
      <label htmlFor="password">Password:</label>
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
        <p role="alert" className="mb-3 text-sm text-red-600">
          {errors.password.message}
        </p>
      )}

      {/* Confirm Password */}
      <label htmlFor="confirmPassword">Confirm Password:</label>
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
        <p role="alert" className="mb-3 text-sm text-red-600">
          {errors.confirmPassword.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 mb-3 w-full rounded-md bg-gradient-to-r from-[#f8997d] to-[#ad336d] p-2 font-semibold text-white"
      >
        Sign Up
      </button>

      {/* Toggle to Sign In */}
      <p className="text-center text-sm">
        Already a member?{" "}
        <span
          className="cursor-pointer font-semibold text-[#ad336d]"
          onClick={toggleAuth}
        >
          Sign in here
        </span>
      </p>
    </form>
  );
}

export default SignUpForm;
