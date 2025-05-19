import { useState } from "react";
import SignInForm from "../../components/SignInForm";
import SignUpForm from "../../components/SignUpForm";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  function toggleAuth() {
    setIsSignIn((prev) => !prev);
  }

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(hero-desktop.jpeg)] bg-cover bg-center">
        <div className="absolute inset-0 backdrop-blur-xs" />

        <section className="z-40 mt-18 w-9/10 max-w-3xl rounded-2xl bg-linear-30 from-[#f8997d] to-[#ad336d] shadow-2xl md:mt-0 md:flex md:min-h-[550px]">
          <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center md:w-1/2">
            <h1 className="text-2xl font-bold tracking-wide text-white md:text-4xl">
              {isSignIn ? "Welcome Back!" : "Hello There!"}
            </h1>
            <p className="text-sm text-gray-100">
              {isSignIn
                ? "You can sign in to access with your existing account."
                : "Become a member to know about our latest news and offers."}
            </p>
          </div>

          {isSignIn ? (
            <SignInForm toggleAuth={toggleAuth} />
          ) : (
            <SignUpForm toggleAuth={toggleAuth} />
          )}
        </section>
      </div>
    </>
  );
}

export default Auth;
