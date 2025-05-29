import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlineShoppingBag } from "react-icons/md";
import cart from "../../utils/cart";

function SingleProdPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [prodImageIndex, setProdImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const markedPrice = product?.priceInfo.markedPriceCents / 100;
  const sellingPrice = product?.priceInfo.sellingPriceCents / 100;
  let discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100) || 0;

  useEffect(() => {
    try {
      (async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        );

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
      <main className="mx-auto pt-15 md:max-w-8/10 md:p-0">
        {isLoading ? (
          <div className="mt-50 flex h-full w-full items-center justify-center">
            <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
          </div>
        ) : (
          <>
            <div className="min-h-screen items-center justify-center md:flex">
              <section className="relative md:w-1/2">
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
                      className={`size-20 rounded-sm object-cover ring-3 ${prodImageIndex === index ? "ring-accent" : "ring-gray-300"}`}
                      onClick={() => {
                        setProdImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </section>

              <section className="mx-auto mt-4 mb-8 w-8/10 max-w-130 space-y-4 md:w-full">
                <p className="text-xs font-extrabold tracking-wider text-gray-700 uppercase">
                  {product.brand}
                </p>
                <h1 className="text-3xl font-extrabold">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>

                <div className="flex items-center justify-between md:flex-col md:items-start md:space-y-4">
                  <p className="flex items-center text-3xl font-extrabold">
                    ${sellingPrice.toFixed(2)}
                    <span className="bg-accent ml-4 rounded-sm px-1 py-0.5 text-xs text-white">
                      {discountRate}%
                    </span>
                  </p>

                  <p className="text-lg font-bold text-gray-600 line-through">
                    ${markedPrice.toFixed(2)}
                  </p>
                </div>

                <div className="gap-4 md:mt-12 md:flex">
                  <div className="flex justify-between rounded-md bg-gray-200 p-3 md:w-4/10">
                    <button onClick={decreaseQty}>
                      <FaMinus className="text-accent cursor-pointer" />
                    </button>

                    <p className="text-lg font-bold">{qty}</p>

                    <button onClick={increaseQty}>
                      <FaPlus className="text-accent cursor-pointer" />
                    </button>
                  </div>

                  <button
                    className="bg-accent flex w-full cursor-pointer items-center justify-center gap-4 rounded-md p-3 text-lg font-bold text-white shadow-xl transition-all hover:scale-101 hover:opacity-95 md:w-6/10"
                    onClick={() => {
                      cart.add(qty, product);
                      setQty(0);
                    }}
                  >
                    <MdOutlineShoppingBag />
                    Add to cart
                  </button>
                </div>

                <div className="relative my-10">
                  <hr className="text-gray-300" />
                  <p className="bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 text-gray-400">
                    OR
                  </p>
                </div>

                <button className="ring-accent hover:bg-accent hover:text-primary flex w-full cursor-pointer items-center justify-center gap-4 rounded-md p-3 text-lg font-bold text-black ring-1 transition-colors">
                  <MdOutlinePayment />
                  Buy Now
                </button>
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default SingleProdPage;
