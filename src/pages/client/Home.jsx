import { useEffect, useState } from "react";
import Hero from "../../components/Hero";
import bannerData from "../../data/banner-data";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

function Home() {
  const [bannerImgIndex, setBannerImgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerImgIndex((prev) => (prev + 1) % bannerData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Hero />

      <div className="relative h-[300px] overflow-hidden md:h-[500px]">
        <AnimatePresence>
          <motion.img
            key={bannerImgIndex}
            src={bannerData[bannerImgIndex].imgUrl}
            className="absolute top-0 left-0 h-full w-full cursor-pointer object-cover"
            onClick={() => {
              navigate(`/shop/custom/${bannerImgIndex}`);
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>
    </>
  );
}

export default Home;
