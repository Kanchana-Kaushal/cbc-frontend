import { MdOutlineShoppingBag, MdSearch, MdHourglassTop } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cart from "../../utils/cart";

function ShopPage() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=${query}`,
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

        if (isSearching === true) {
          setIsSearching(false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [query]);

  const productCards = products.map((product) => {
    const markedPrice = product.priceInfo.markedPriceCents / 100;
    const sellingPrice = product.priceInfo.sellingPriceCents / 100;
    const discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100);

    return (
      <article
        className="group relative overflow-hidden rounded-lg border border-white/50 bg-white/80 p-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gray-200 hover:shadow-2xl"
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
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
            className="ring-accent text-accent group hover:bg-accent relative w-full cursor-pointer overflow-hidden rounded-sm p-1.5 text-sm font-semibold ring-1 transition-all duration-300 hover:scale-[1.02] hover:text-white hover:shadow-lg active:scale-[0.98] md:p-2 md:text-base"
            onClick={() => {
              cart.add(1, product);
            }}
          >
            <div className="relative flex items-center justify-center gap-1.5 md:gap-2">
              <MdOutlineShoppingBag className="text-base transition-transform duration-300 group-hover:scale-110 md:text-lg" />
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
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 md:mb-4 md:text-4xl">
                All Products
              </h1>
              <div className="bg-accent mx-auto h-0.5 w-16 rounded-full md:h-1 md:w-24" />
              <p className="mx-auto mt-3 max-w-2xl px-4 text-sm text-gray-600 md:mt-6 md:text-lg">
                Discover our curated collection
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-6 max-w-lg md:mt-8">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                    <MdSearch className="h-4 w-4 text-gray-500 md:h-5 md:w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full rounded-full border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none md:py-3 md:pr-5 md:pl-12 md:text-base"
                    onChange={(e) => {
                      setQuery(e.currentTarget.value);
                      setIsSearching(true);
                    }}
                  />
                </div>
              </div>
            </div>

            {isSearching ? (
              <div className="flex w-full items-center justify-center pt-15">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <MdHourglassTop className="h-8 w-8 animate-bounce text-blue-600 md:h-10 md:w-10" />
                  </div>
                  <p className="animate-pulse text-sm font-medium text-gray-700">
                    Finding products...
                  </p>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default ShopPage;
