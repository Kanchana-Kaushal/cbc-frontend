import { MdOutlineShoppingBag } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import cart from "../../utils/cart";

function ShopPage() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setProducts(data.data.products);
        setIsLoading(false);
      } catch (error) {}
    })();
  }, [isLoading]);

  const productCards = products.map((product) => {
    const markedPrice = product.priceInfo.markedPriceCents / 100;
    const sellingPrice = product.priceInfo.sellingPriceCents / 100;
    const discountRate = 100 - Math.round((sellingPrice / markedPrice) * 100);

    return (
      <article
        className="space-y-4 rounded-2xl p-5 shadow-xl ring-1 ring-gray-300 md:max-w-90"
        key={product.productId}
      >
        <div
          className="aspect-square cursor-pointer overflow-hidden rounded-xl"
          onClick={() => {
            navigate("/product/" + product._id);
          }}
        >
          <img
            src={product.images[0]}
            alt=""
            className="rounded-xl object-cover transition-all hover:scale-110"
          />
        </div>

        <h2 className="min-h-15 text-xl">{product.name}</h2>

        <div className="flex items-center justify-between">
          <p className="text-3xl font-extrabold">
            ${markedPrice.toFixed(2)}
            <span className="ml-2 text-base font-normal text-gray-700 line-through">
              ${sellingPrice}
            </span>
          </p>

          <p className="bg-accent text-primary w-fit rounded-md p-1 py-0.5 text-xs font-semibold">
            {discountRate}%
          </p>
        </div>

        <button
          className="bg-accent mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md p-4 py-2 text-lg font-bold text-white transition-all hover:scale-101 hover:opacity-85"
          onClick={() => {
            cart.add(1, product);
          }}
        >
          <MdOutlineShoppingBag />
          Add to cart
        </button>
      </article>
    );
  });

  console.log(cart.getQty());

  return (
    <main className="min-h-screen pt-25">
      {isLoading ? (
        <div className="mt-50 flex h-full w-full items-center justify-center">
          <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
        </div>
      ) : (
        <>
          <h1 className="text-center text-4xl">All Products</h1>
          <section className="mx-auto mt-12 grid w-9/10 gap-8 md:w-8/10 md:grid-cols-2 xl:grid-cols-4">
            {productCards}
          </section>
        </>
      )}
    </main>
  );
}

export default ShopPage;
