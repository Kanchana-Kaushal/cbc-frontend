import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const checkEmailExists = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-user`,
        {
          email: data.email,
        },
      );

      if (response.status === 200) {
        setEmail(data.email);
        setIsEmailValid(true);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (isEmailValid) {
      requestVerificationCode();
    }
  }, [isEmailValid]);

  const requestVerificationCode = async () => {
    const loadingToastId = toast.loading("Sending Code...");
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/send-code",
        { email },
      );

      toast.success(response.data.message, { id: loadingToastId });
      setTimeLeft(300);
    } catch (err) {
      toast.error(err.response.data.error, { id: loadingToastId });
    }
  };

  const changePassword = async (data) => {
    const password = data.password;
    const loadingToastId = toast.loading("Verifying...");

    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/user/change-password",
        {
          code,
          data: { email, password },
        },
      );

      toast.success(response.data.message, { id: loadingToastId });
      navigate("/auth");
    } catch (err) {
      console.log(err.response.data.error, { id: loadingToastId });
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const password = watch("password");

  return (
    <>
      <main className="flex min-h-150 items-center justify-center bg-[url(/hero-desktop.jpeg)] bg-cover bg-center md:min-h-screen">
        <section className="w-9/10 max-w-sm rounded-2xl bg-white p-6 text-center ring-1 ring-gray-100 drop-shadow-xl md:p-8">
          {!!email ? (
            <>
              <h1 className="text-lg font-bold capitalize md:text-xl lg:text-2xl">
                Enter Your New Password
              </h1>

              <p className="l mt-2 text-xs text-gray-500 md:text-sm">
                Please enter you new password along with the code we sent you to
                your email{" "}
                <span className="font-bold text-gray-800">{email}</span>
              </p>

              {/* Password */}

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
                placeholder="New Password"
                autoComplete="new-password"
                name="password"
                className="mt-4 mb-1 w-full rounded-lg p-1 text-center ring-1 ring-gray-300 outline-0 md:p-2"
              />
              {errors.password && (
                <p role="alert" className="text-right text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}

              {/* Confirm Password */}

              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="Re-Type Password"
                name="confirmPassword"
                className="mt-4 mb-1 w-full rounded-lg p-1 text-center ring-1 ring-gray-300 outline-0 md:p-2"
              />
              {errors.confirmPassword && (
                <p role="alert" className="text-right text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}

              <div className="mx-auto my-6 md:text-lg lg:text-xl">
                <input
                  type="text"
                  className="w-full rounded-lg p-1 text-center ring-1 ring-gray-300 outline-0 md:p-2"
                  placeholder="OTP"
                  maxLength={4}
                  value={code}
                  onChange={(e) => {
                    setCode(e.currentTarget.value);
                  }}
                />
                <p className="mt-1.5 text-right text-xs text-gray-500 md:mt-2 md:text-sm">
                  Resend code in{" "}
                  <span className="ml-1 font-bold text-gray-800">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>

              <button
                className={`${timeLeft > 0 ? "opacity-50" : "cursor-pointer opacity-100 hover:bg-gray-300"} lg: max-h-fit w-full cursor-not-allowed rounded-lg bg-gray-200 py-1.5 text-sm font-bold text-gray-700 transition md:text-base`}
                disabled={timeLeft > 0 ? true : false}
                onClick={() => {
                  requestVerificationCode;
                }}
              >
                Resend Code
              </button>

              <button
                className={`${code.length === 4 ? "bg-accent cursor-pointer" : "bg-accent/60 cursor-not-allowed"} mt-2 w-full rounded-lg py-1.5 text-sm font-bold text-white transition md:text-base lg:mt-3`}
                onClick={handleSubmit(changePassword)}
                disabled={code.length === 4 ? false : true}
              >
                Verify
              </button>
            </>
          ) : (
            <div className="space-y-8">
              <h1 className="text-lg font-bold capitalize md:text-xl lg:text-2xl">
                Enter your email that associated with our website
              </h1>

              <div>
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
                  className="w-full rounded-md p-2 px-3 ring-1 ring-gray-400 focus:outline-gray-600"
                />
                {errors.email && (
                  <p
                    role="alert"
                    className="mt-1 text-right text-xs text-red-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                className="ring-accent text-accent hover:bg-accent flex w-full cursor-pointer items-center justify-center gap-3 rounded-md p-2 font-bold ring-1 transition hover:text-white"
                onClick={handleSubmit(checkEmailExists)}
              >
                Next <FaArrowRightLong />
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ForgotPasswordPage;
