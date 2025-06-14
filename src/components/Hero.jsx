import { motion } from "motion/react";

function Hero() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url(hero-mobile.jpeg)] bg-cover bg-fixed md:justify-start md:bg-[url(hero-desktop.jpeg)]">
      <div className="mx-auto w-9/10 md:w-8/10">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto w-fit p-4 py-12 text-3xl font-bold tracking-widest text-white uppercase ring-2 sm:text-5xl md:ml-0 md:text-6xl"
        >
          Explore the <br /> best brands.
        </motion.h1>
      </div>
    </div>
  );
}

export default Hero;
