import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import bannerData from "../../data/banner-data";
import cart from "../../utils/cart";

function CustomShopPage() {
  const params = useParams();
  const type = params.type;
  const criteria = params.criteria;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const topic = bannerData[criteria]?.topic ?? criteria;
  const description =
    bannerData[criteria]?.description ?? "Discover our curated collection";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (type === "custom") {
      (async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=${bannerData[criteria].query}`,
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
    } else {
      (async () => {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/custom`,
            {
              criteria:
                criteria === "best-seller"
                  ? { bestSeller: true }
                  : { category: criteria },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setProducts(data.data.products);

          if (isLoading === true) {
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

  const productCards = products.map((product) => {
    const markedPrice = product.priceInfo.markedPriceCents / 100;
    const sellingPrice = product.priceInfo.sellingPriceCents / 100;
    const discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100);

    return (
      <article
        className="group relative overflow-hidden rounded-lg border border-white/50 bg-white/80 p-0 shadow-lg backdrop-blur-sm md:transition-all md:duration-300 md:hover:border-gray-200 md:hover:shadow-2xl"
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

  return (
    <main>
      {isLoading ? (
        <div className="flex min-h-150 w-full items-center justify-center md:min-h-screen">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 md:h-20 md:w-20" />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20 md:pt-25">
          <div className="container mx-auto px-3 pb-12 md:px-4 md:pb-16">
            {/* Header Section */}
            <div className="mb-8 text-center md:mb-16">
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 capitalize md:mb-4 md:text-4xl">
                {topic}
              </h1>
              <div className="bg-accent mx-auto h-0.5 w-16 rounded-full md:h-1 md:w-24" />
              <p className="mx-auto mt-3 max-w-2xl px-4 text-sm text-gray-600 md:mt-6 md:text-lg">
                {description}
              </p>
            </div>

            {/* Products Grid */}
            <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
              {productCards}
            </section>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="py-12 text-center md:py-20">
                <div className="mb-3 text-gray-400 md:mb-4">
                  <MdOutlineShoppingBag className="mx-auto text-4xl md:text-6xl" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-600 md:mb-2 md:text-xl">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 md:text-base">
                  Check back later for new arrivals
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default CustomShopPage;
