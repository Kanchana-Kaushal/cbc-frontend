import { useEffect, useState } from "react";
import Hero from "../../components/Hero";
import bannerData from "../../data/banner-data";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { MdOutlineShoppingBag } from "react-icons/md";
import cart from "../../utils/cart";
import faqArray from "../../data/faq-data";
import { IoIosStar } from "react-icons/io";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import categories from "../../data/category-data";
import { MdEmail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { BiSupport } from "react-icons/bi";

function Home() {
  const token = localStorage.getItem("token");

  const [bannerImgIndex, setBannerImgIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faq, setFaqArray] = useState(faqArray);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerImgIndex((prev) => (prev + 1) % bannerData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setProducts(data.products);

        if (isLoading === true) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  function toggleAnswer(item) {
    setFaqArray((prev) =>
      prev.map((faq) =>
        item === faq
          ? { ...item, answerShown: !item.answerShown }
          : { ...faq, answerShown: false },
      ),
    );
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const message =
      "Hi! I need help with your beauty products. Can you assist me?";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const bestSellersArr = products
    .filter((product) => product.bestSeller === true)
    .slice(0, 6);

  const bestSellers = bestSellersArr.map((product) => {
    const markedPrice = product.priceInfo.markedPriceCents / 100;
    const sellingPrice = product.priceInfo.sellingPriceCents / 100;
    const discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100);

    return (
      <article
        className="group relative min-w-7/10 snap-center snap-always overflow-hidden rounded-lg border border-white/50 bg-white/80 p-0 shadow-lg backdrop-blur-sm md:min-w-auto md:transition-all md:duration-300 md:hover:border-gray-200 md:hover:shadow-2xl"
        key={product.productId}
      >
        {/* Discount Badge */}
        {discountRate > 0 && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 text-[0.6rem] font-bold text-white shadow-lg md:top-3 md:left-3 md:px-3 md:py-1">
            -{discountRate}%
          </div>
        )}

        {/* Product Image */}
        <div
          className="relative aspect-square cursor-pointer overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          onClick={() => {
            navigate("/product/" + product._id);
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover md:transition-all md:duration-700 md:group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />
        </div>

        {/* Product Info */}
        <div className="space-y-2 p-3 md:space-y-3 md:p-4">
          <h2 className="line-clamp-2 text-sm text-gray-900 md:min-h-[3rem] md:text-base">
            {product.name}
          </h2>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline justify-between space-x-1 md:space-x-2">
              <p className="font-bold text-gray-900 md:text-xl">
                ${sellingPrice.toFixed(2)}
              </p>
              {markedPrice !== sellingPrice && (
                <span className="text-xs text-gray-500 line-through md:text-sm">
                  ${markedPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="ring-accent text-accent group hover:bg-accent relative w-full cursor-pointer overflow-hidden rounded-sm p-1.5 text-sm font-semibold ring-1 hover:text-white md:p-2 md:text-base md:transition-all md:duration-300 md:hover:scale-[1.02] md:hover:text-white md:hover:shadow-lg md:active:scale-[0.98]"
            onClick={() => {
              cart.add(1, product);
            }}
          >
            <div className="relative flex items-center justify-center gap-1.5 md:gap-2">
              <MdOutlineShoppingBag className="text-base md:text-lg md:transition-transform md:duration-300 md:group-hover:scale-110" />
              <span className="hidden md:inline">Add to Cart</span>
              <span className="md:hidden">Add</span>
            </div>
          </button>
        </div>
      </article>
    );
  });

  const newArrivals = products.slice(0, 6).map((product) => {
    const markedPrice = product.priceInfo.markedPriceCents / 100;
    const sellingPrice = product.priceInfo.sellingPriceCents / 100;
    const discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100);

    return (
      <article
        className="group relative min-w-7/10 snap-center snap-always overflow-hidden rounded-lg border border-white/50 bg-white/80 p-0 shadow-lg backdrop-blur-sm md:min-w-auto md:transition-all md:duration-300 md:hover:border-gray-200 md:hover:shadow-2xl"
        key={product.productId}
      >
        {/* Discount Badge */}
        {discountRate > 0 && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 text-[0.6rem] font-bold text-white shadow-lg md:top-3 md:left-3 md:px-3 md:py-1">
            -{discountRate}%
          </div>
        )}

        {/* Product Image */}
        <div
          className="relative aspect-square cursor-pointer overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          onClick={() => {
            navigate("/product/" + product._id);
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover md:transition-all md:duration-700 md:group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />
        </div>

        {/* Product Info */}
        <div className="space-y-2 p-3 md:space-y-3 md:p-4">
          <h2 className="line-clamp-2 text-sm text-gray-900 md:min-h-[3rem] md:text-base">
            {product.name}
          </h2>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline justify-between space-x-1 md:space-x-2">
              <p className="font-bold text-gray-900 md:text-xl">
                ${sellingPrice.toFixed(2)}
              </p>
              {markedPrice !== sellingPrice && (
                <span className="text-xs text-gray-500 line-through md:text-sm">
                  ${markedPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="ring-accent text-accent group hover:bg-accent relative w-full cursor-pointer overflow-hidden rounded-sm p-1.5 text-sm font-semibold ring-1 hover:text-white md:p-2 md:text-base md:transition-all md:duration-300 md:hover:scale-[1.02] md:hover:text-white md:hover:shadow-lg md:active:scale-[0.98]"
            onClick={() => {
              cart.add(1, product);
            }}
          >
            <div className="relative flex items-center justify-center gap-1.5 md:gap-2">
              <MdOutlineShoppingBag className="text-base md:text-lg md:transition-transform md:duration-300 md:group-hover:scale-110" />
              <span className="hidden md:inline">Add to Cart</span>
              <span className="md:hidden">Add</span>
            </div>
          </button>
        </div>
      </article>
    );
  });

  const faqElements = faq.map((item, index) => (
    <article className="space-y-4" key={index}>
      <div
        className="flex cursor-pointer items-center justify-between gap-8 rounded-md p-2 transition-colors duration-200 hover:bg-gray-50"
        onClick={() => toggleAnswer(item)}
      >
        <p className="text-Dark-purple hover:text-accent text-sm font-bold transition-colors duration-200 md:text-lg">
          {item.question}
        </p>
        {item.answerShown ? (
          <FaMinusCircle className="text-accent cursor-pointer transition-transform duration-200 hover:scale-105" />
        ) : (
          <FaPlusCircle className="text-accent cursor-pointer transition-transform duration-200 hover:scale-105" />
        )}
      </div>

      <AnimatePresence>
        {item.answerShown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-Grayish-purple rounded-md bg-gray-50 p-3 text-sm font-medium md:text-base">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {faq.length - 1 !== index && (
        <hr className="text-Dark-purple opacity-20" />
      )}
    </article>
  ));

  const categoryElements = categories.map((category) => (
    <div
      key={category.id}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      onClick={() => navigate(`/shop/category/${category.id}`)}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 transition-opacity duration-300 group-hover:opacity-20`}
      />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-800 md:text-2xl">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 transition-colors group-hover:text-gray-700 md:text-base">
            {category.description}
          </p>
        </div>

        {/* Arrow Icon */}
        <div className="mt-4 flex items-center text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-600">
          <span className="text-sm font-medium">Shop Now</span>
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <Hero />

      <div className="w-full">
        <div className="relative aspect-[3/1] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={bannerImgIndex}
              src={bannerData[bannerImgIndex].imgUrl}
              onClick={() => {
                navigate(`/shop/custom/${bannerImgIndex}`);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              loading="eager" // For banner images
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto mt-8 w-9/10 md:my-16 md:w-8/10">
        <div className="flex items-center justify-between md:mb-8">
          <h2 className="text-2xl font-bold md:text-3xl">Best Sellers</h2>
          <button
            className="text-accent lg:hover:bg-accent cursor-pointer rounded-2xl px-4 py-1 text-xs ring-1 transition md:text-sm lg:hover:text-white"
            onClick={() => {
              navigate("/shop/category/best-seller");
            }}
          >
            See More
          </button>
        </div>
        {isLoading ? (
          <>
            <div className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-8 overflow-x-auto p-8 md:hidden">
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  className="mx-auto min-w-7/10 animate-pulse snap-center snap-always rounded-md shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-8 rounded-md bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-3 gap-8 md:grid lg:hidden">
              {[1, 2, 3].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-4 gap-8 lg:grid xl:hidden">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-5 gap-8 xl:grid">
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl duration-2000"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-8 overflow-x-auto p-8 md:hidden">
              {bestSellers}
            </div>

            <div className="mx-auto hidden grid-cols-3 gap-8 md:grid lg:hidden">
              {bestSellers.slice(0, 3)}
            </div>

            <div className="mx-auto hidden grid-cols-4 gap-8 lg:grid xl:hidden">
              {bestSellers.slice(0, 4)}
            </div>

            <div className="mx-auto hidden grid-cols-5 gap-8 xl:grid">
              {bestSellers.slice(0, 5)}
            </div>
          </>
        )}
      </div>

      <div className="mx-auto mt-8 w-9/10 md:my-16 md:w-8/10">
        <div className="flex items-center justify-between md:mb-8">
          <h2 className="text-2xl font-bold md:text-3xl">New Arrivals</h2>
        </div>
        {isLoading ? (
          <>
            <div className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-8 overflow-x-auto p-8 md:hidden">
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  className="mx-auto min-w-7/10 animate-pulse snap-center snap-always rounded-md shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-8 rounded-md bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-3 gap-8 md:grid lg:hidden">
              {[1, 2, 3].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-4 gap-8 lg:grid xl:hidden">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto hidden grid-cols-5 gap-8 xl:grid">
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  className="animate-pulse rounded-lg shadow-xl duration-2000"
                  key={skeleton}
                >
                  <div className="min-h-50 rounded-t-lg bg-gray-100" />
                  <div className="space-y-1 p-4">
                    <div className="min-h-3 bg-gray-300" />
                    <div className="min-h-3 w-2/3 bg-gray-300" />
                    <div className="my-3 min-h-5 w-1/3 bg-gray-300" />{" "}
                    <div className="min-h-10 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-8 overflow-x-auto p-8 md:hidden">
              {newArrivals}
            </div>

            <div className="mx-auto hidden grid-cols-3 gap-8 md:grid lg:hidden">
              {newArrivals.slice(0, 3)}
            </div>

            <div className="mx-auto hidden grid-cols-4 gap-8 lg:grid xl:hidden">
              {newArrivals.slice(0, 4)}
            </div>

            <div className="mx-auto hidden grid-cols-5 gap-8 xl:grid">
              {newArrivals.slice(0, 5)}
            </div>
          </>
        )}
      </div>

      <div className="mx-auto my-16 w-9/10 md:w-8/10">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Shop by Category
          </h2>
        </div>

        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 lg:gap-8">
          {categoryElements}
        </div>
      </div>

      <div className="relative my-16 flex flex-col items-center justify-center">
        <div className="w-9/10 rounded-lg bg-white p-6 shadow-lg md:w-8/10">
          <div className="mb-4 flex items-center gap-4">
            <IoIosStar className="text-accent size-5 md:size-7" />
            <h1 className="text-accent text-2xl font-bold md:text-4xl">FAQs</h1>
          </div>

          <section className="space-y-4">{faqElements}</section>
        </div>
      </div>

      <div className="mx-auto my-16 max-w-xl p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-pink-100 to-rose-100 p-4">
              <BiSupport className="h-8 w-8 text-rose-500" />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-light text-gray-800">
            Need Beauty Advice?
          </h2>

          <p className="leading-relaxed text-gray-600">
            Our beauty experts are here to help you find the perfect products
            for your skin. Get personalized recommendations!
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleWhatsAppClick}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-3 text-sm font-light text-white shadow-lg transition-all duration-300 hover:from-emerald-500 hover:to-green-600 hover:shadow-xl"
          >
            <IoLogoWhatsapp size={18} />
            WhatsApp
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-light text-gray-400">
            Get expert beauty advice • Free consultations • Quick response
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
