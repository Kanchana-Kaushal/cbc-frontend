import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url(/hero-mobile.jpeg)] bg-cover bg-fixed md:justify-start md:bg-[url(/hero-desktop.jpeg)]">
      <div className="mx-auto w-9/10 md:w-8/10">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative mx-auto w-8/10 p-4 py-20 text-3xl font-bold tracking-widest text-white uppercase ring-2 sm:text-5xl md:ml-0 md:w-fit md:p-8 md:py-12 md:text-6xl"
        >
          <h1 className="text-center">
            Explore the <br /> best brands.
          </h1>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
            className="hover:bg-accent absolute -bottom-5 left-1/2 mx-auto block -translate-x-1/2 cursor-pointer px-4 py-2 text-base text-white ring-2 ring-white backdrop-blur-md transition"
            onClick={() => {
              navigate("/shop");
            }}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
