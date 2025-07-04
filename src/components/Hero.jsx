import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-150 items-center justify-center bg-[url(/hero-section-mobile.jpg)] bg-cover bg-fixed bg-right md:min-h-screen md:justify-start md:bg-[url(/hero-section-img.jpg)] md:bg-left-top">
      <div className="mx-auto w-9/10 md:w-8/10">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-accent relative w-fit p-4 pb-10 text-3xl font-bold tracking-widest uppercase sm:text-5xl md:mx-auto md:ml-0 md:p-8 md:py-12 md:text-6xl md:ring-2"
        >
          <h1 className="text-left md:text-center">
            Explore <br className="md:hidden" /> the <br /> best{" "}
            <br className="md:hidden" /> brands.
          </h1>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
            className="hover:bg-accent text-accent ring-accent absolute -bottom-5 left-1/2 mx-auto block min-w-40 -translate-x-1/2 cursor-pointer px-4 py-2 text-base ring-2 backdrop-blur-md transition hover:text-white md:hover:text-white"
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
