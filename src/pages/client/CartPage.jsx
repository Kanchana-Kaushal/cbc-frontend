import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import cart from "../../utils/cart.js";

function CartPage() {
  const [cartItems, setCartItems] = useState(cart.get);

  const navigate = useNavigate();

  let total = 0;

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      total += item.qty * item.priceCents;
    });
  }

  function decreaseQty(productId) {
    const newCart = cartItems.map((item) => {
      if (item.productId === productId) {
        if (item.qty <= 1) {
          return;
        }

        return { ...item, qty: item.qty - 1 };
      }

      return item;
    });

    const cleanedCart = newCart.filter(Boolean);

    setCartItems(cart.save(cleanedCart));
  }

  function increaseQty(productId) {
    const newCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, qty: item.qty + 1 } : item,
    );

    setCartItems(cart.save(newCart));
  }

  function CartItems() {
    return cartItems.map((item) => {
      const priceCents = item.priceCents;
      const totalPriceCents = priceCents * item.qty;
      const price = (priceCents / 100).toFixed(2);
      const totalPrice = (totalPriceCents / 100).toFixed(2);

      return (
        <div
          className="flex items-center gap-4 rounded-xl bg-white p-3 ring-1 ring-gray-200"
          key={item.productId}
        >
          <img
            src={item.image}
            alt={"image product id" + item.productId}
            className="w-2/10 max-w-20 rounded-md"
          />

          <div className="flex w-full items-center justify-between">
            <div className="w-full items-center justify-between space-y-2 md:flex md:px-6">
              <div>
                <p className="text-xs font-bold text-gray-500">
                  {item.productId}
                </p>
                <h2 className="text-sm font-bold">{item.name}</h2>
              </div>
              <p className="text-sm font-bold">
                ${totalPrice}
                <span className="ml-3 text-xs font-normal text-gray-500">
                  (${price}x {item.qty})
                </span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-accent cursor-pointer rounded-full p-1 text-white opacity-80"
                  onClick={() => {
                    decreaseQty(item.productId);
                  }}
                >
                  <FaMinus className="text-sm" />
                </button>

                <p className="text-sm font-bold">{item.qty}</p>

                <button
                  className="bg-accent cursor-pointer rounded-full p-1 text-white opacity-80"
                  onClick={() => {
                    increaseQty(item.productId);
                  }}
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <main className="mx-auto min-h-screen w-9/10 pt-15 md:w-8/10 md:overflow-y-hidden md:p-4 md:pt-0">
        <div className="">
          {cartItems.length === 0 ? (
            <div className="flex min-h-screen items-center justify-center">
              <div className="mx-auto space-y-6 rounded-md p-8 ring-1 ring-gray-400 md:max-w-xl">
                <h1 className="text-center text-gray-700">
                  There is no item to show right now, Add some items to the cart
                </h1>

                <button
                  className="bg-accent mx-auto block cursor-pointer rounded-md px-4 py-2 text-white opacity-80 hover:opacity-100"
                  onClick={() => {
                    navigate("/shop");
                  }}
                >
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 md:flex">
                <div className="space-y-4 overflow-y-scroll md:max-h-screen md:min-h-screen md:w-6/10 md:p-4 md:pt-12">
                  <div className="mx-auto mt-12 mb-6 flex w-9/10 items-center justify-between">
                    <h1 className="text-center text-2xl font-bold md:text-left">
                      My Cart
                    </h1>

                    <button
                      className="hover:bg-accent cursor-pointer rounded-xs px-2 text-sm text-gray-500 ring-1 ring-gray-400 transition-colors hover:text-white"
                      onClick={() => {
                        setCartItems(cart.save([]));
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <CartItems />
                </div>

                <div className="items-center justify-center md:flex md:w-4/10">
                  <div className="mx-auto mb-4 space-y-2 rounded-xl bg-white p-8 ring-1 ring-gray-300 lg:w-8/10">
                    <h2 className="mb-6 text-center text-xl">Cart Summery</h2>

                    <div className="flex items-center justify-between font-bold">
                      <p>Total</p>
                      <p>${(total / 100).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between font-bold">
                      <p>Shipping</p>
                      <p>$4.99</p>
                    </div>

                    <hr className="my-4 text-gray-400" />

                    <div className="flex items-center justify-between font-bold">
                      <p>Sub Total</p>
                      <p>${((total + 499) / 100).toFixed(2)}</p>
                    </div>

                    <button
                      className="bg-accent mt-6 flex w-full cursor-pointer items-center justify-center gap-4 rounded-md px-4 py-2 text-white"
                      onClick={() => {
                        navigate("/checkout", { state: cartItems });
                      }}
                    >
                      <MdOutlinePayment />
                      Checkout
                    </button>

                    <button
                      className="ring-accent mt-2 w-full cursor-pointer rounded-md bg-white px-4 py-2 ring-1"
                      onClick={() => {
                        navigate("/shop");
                      }}
                    >
                      Continue shopping
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default CartPage;
