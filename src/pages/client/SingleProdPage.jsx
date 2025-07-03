import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlineShoppingBag } from "react-icons/md";
import cart from "../../utils/cart";
import ProductReviews from "../../components/ProductReviews";
import { IoStar } from "react-icons/io5";

function SingleProdPage() {
  const params = useParams();
  const productId = params.id;
  const navigate = useNavigate();

  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [prodImageIndex, setProdImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);

  const markedPrice = product?.priceInfo.markedPriceCents / 100;
  const sellingPrice = product?.priceInfo.sellingPriceCents / 100;
  let discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100) || 0;

  useEffect(() => {
    try {
      (async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        );

        setReviews(response.data.data.reviews);
        setProduct(response.data.data.product);
        setIsLoading(false);
      })();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }, [isLoading]);

  function increaseQty() {
    if (qty >= 100) {
      return;
    }

    setQty((prev) => prev + 1);
  }

  function decreaseQty() {
    if (qty === 1) {
      return;
    }

    setQty((prev) => prev - 1);
  }

  function slideImageLeft() {
    if (product.images.length - 1 > prodImageIndex) {
      setProdImageIndex((prev) => prev + 1);
    }
  }

  function slideImageRight() {
    if (prodImageIndex > 0) {
      setProdImageIndex((prev) => prev - 1);
    }
  }

  return (
    <>
      <main className="mx-auto md:max-w-8/10">
        {isLoading ? (
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 md:h-20 md:w-20" />
            </div>
          </div>
        ) : (
          <>
            <div className="items-center justify-center pt-15 md:flex md:p-0">
              <section className="relative justify-center md:mt-30 md:flex md:w-1/2">
                <div className="md:max-w-95">
                  <div className="mx-auto aspect-square max-w-100 bg-amber-100">
                    <img
                      src={product.images[prodImageIndex]}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div
                    className="ring-accent absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white p-3 ring-1 drop-shadow-2xl md:hidden"
                    onClick={slideImageRight}
                  >
                    <FaChevronLeft />
                  </div>

                  <div
                    className="ring-accent absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white p-3 ring-1 drop-shadow-2xl md:hidden"
                    onClick={slideImageLeft}
                  >
                    <FaChevronRight />
                  </div>

                  <div className="mt-4 hidden items-center justify-center gap-4 md:flex">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        className={`size-20 cursor-pointer object-cover ring-2 ${prodImageIndex === index ? "ring-accent" : "ring-gray-300"}`}
                        onClick={() => {
                          setProdImageIndex(index);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section className="mx-auto mt-12 mb-8 w-8/10 max-w-110 space-y-4 md:mt-30 md:w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      {product.brand}
                    </p>

                    {product.bestSeller && (
                      <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                        <span className="mx-2 text-gray-900">|</span> Best
                        Seller
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <IoStar className="text-sm text-orange-400" />
                    <p className="text-sm font-semibold">
                      {product.rating.average.toFixed(1)}{" "}
                      <span className="text-xs">({product.rating.count})</span>
                    </p>
                  </div>
                </div>

                <h1 className="text-2xl font-extrabold">{product.name}</h1>
                <p className="text-xs text-gray-400 md:text-sm">
                  {product.description}
                </p>

                <div className="my-6 flex items-center justify-between">
                  <p className="flex items-center text-2xl font-extrabold">
                    ${sellingPrice.toFixed(2)}
                    <span className="bg-accent ml-4 rounded-sm px-1 py-0.5 text-xs text-white">
                      {discountRate}%
                    </span>
                  </p>

                  <p className="font-bold text-gray-600 line-through">
                    ${markedPrice.toFixed(2)}
                  </p>
                </div>

                <div className="gap-4 space-y-4 md:flex md:space-y-0">
                  <div className="flex justify-between rounded-md bg-gray-200 p-3 md:w-4/10">
                    <button onClick={decreaseQty}>
                      <FaMinus className="text-accent cursor-pointer" />
                    </button>

                    <p className="font-bold">{qty}</p>

                    <button onClick={increaseQty}>
                      <FaPlus className="text-accent cursor-pointer" />
                    </button>
                  </div>

                  <button
                    className="bg-accent flex w-full cursor-pointer items-center justify-center gap-4 rounded-md p-3 font-bold text-white transition-all hover:scale-101 hover:opacity-95 md:w-6/10"
                    onClick={() => {
                      cart.add(qty, product);
                      setQty(1);
                    }}
                  >
                    <MdOutlineShoppingBag />
                    Add to cart
                  </button>
                </div>

                <div className="relative my-6">
                  <hr className="mx-auto w-7/10 text-gray-200" />
                  <p className="bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 text-xs text-gray-400">
                    OR
                  </p>
                </div>

                <button
                  className="ring-accent hover:bg-accent hover:text-primary flex w-full cursor-pointer items-center justify-center gap-4 rounded-md p-3 font-bold text-black ring-1 transition-colors"
                  onClick={() => {
                    navigate("/buy-now", {
                      state: {
                        item: {
                          _id: product._id,
                          productId: product.productId,
                          name: product.name,
                          qty: qty,
                          priceCents: product.priceInfo.sellingPriceCents,
                          image: product.images[0],
                        },
                      },
                    });
                  }}
                >
                  <MdOutlinePayment />
                  Buy Now
                </button>
              </section>
            </div>

            <ProductReviews
              reviews={reviews}
              productId={product._id}
              setIsLoading={setIsLoading}
            />
          </>
        )}
      </main>
    </>
  );
}

export default SingleProdPage;
