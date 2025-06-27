import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [code, setCode] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state.data;

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
    requestVerificationCode();
  }, []);

  const requestVerificationCode = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/send-code",
        { email: data.email },
      );

      toast.success(response.data.message);
      setTimeLeft(5 * 60);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const verifyCodeAndSignUp = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/sign-up",
        { data, code: code },
      );

      localStorage.setItem("token", response.data.data.token);
      const user = JSON.stringify(response.data.data.user);
      localStorage.setItem("user", user);

      navigate("/");
      toast.success("User created successfully");
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-[url(/hero-desktop.jpeg)] bg-cover bg-center">
        <section className="w-9/10 max-w-sm rounded-2xl bg-white p-6 text-center ring-1 ring-gray-100 drop-shadow-xl md:p-8">
          <h1 className="text-lg font-bold capitalize md:text-xl lg:text-2xl">
            Verify your email address
          </h1>

          <p className="l mt-2 text-xs text-gray-500 md:text-sm">
            Please enter the 4-digit verification code sent to{" "}
            <span className="font-bold text-gray-800">{data.email}</span>
          </p>

          <div className="mx-auto my-6 md:text-lg lg:text-xl">
            <input
              type="text"
              className="w-full rounded-lg p-1 text-center ring-1 ring-gray-300 outline-0 md:p-2"
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
            onClick={verifyCodeAndSignUp}
            disabled={code.length === 4 ? false : true}
          >
            Verify
          </button>
        </section>
      </main>
    </>
  );
}

export default VerifyEmailPage;
