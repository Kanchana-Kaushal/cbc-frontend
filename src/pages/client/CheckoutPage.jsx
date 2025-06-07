import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCashCoin } from "react-icons/bs";
import { LuCreditCard } from "react-icons/lu";
import cart from "../../utils/cart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState(cart.get);

  const navigate = useNavigate();

  let total = 0;

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      total += item.qty * item.priceCents;
    });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user) {
      toast.error("You must sign in first to make a purchase");
      navigate("/auth");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admins cannot make purchases");
      return;
    }

    const products = cartItems.map((item) => ({
      productId: item._id,
      qty: item.qty,
    }));

    const orderData = {
      userId: user.userId,
      deliveryDetails: {
        recieversName: data.name,
        address: {
          street: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          country: data.country,
        },
        tel: data.primaryPhone,
        tel02: data.secondaryPhone,
      },
      paymentMethod: data.paymentMethod,
      products,
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders/place-order",
        { ...orderData },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Order Placed Successfully");
      cart.save([]);

      navigate("/shop");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "An error occurred while placing order",
      );
    }
  };

  const getDeliveryDate = () => {
    const today = new Date();

    const after7days = new Date(today);
    after7days.setDate(today.getDate() + 7);

    const after14days = new Date(today);
    after14days.setDate(today.getDate() + 14);

    const formatOptions = { month: "long", day: "numeric" };

    const formattedAfter7days = after7days.toLocaleDateString(
      "en-US",
      formatOptions,
    );
    const formattedAfter14days = after14days.toLocaleDateString(
      "en-US",
      formatOptions,
    );

    return `${formattedAfter7days} - ${formattedAfter14days}`;
  };

  return (
    <main className="mx-auto min-h-screen w-9/10 pt-20 md:w-8/10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-20 justify-between gap-12 lg:flex"
      >
        <div className="space-y-4 lg:w-1/2">
          <h2 className="mt-8 mb-4 text-2xl font-bold">Shipping Information</h2>

          <div>
            <label htmlFor="name">Reciever's Name:</label>
            <input
              id="name"
              type="text"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("name", {
                required: "Receiver's  name is required",
                minLength: {
                  value: 2,
                  message: "Should be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Should not exceed 50 characters",
                },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address">Street Address:</label>
            <input
              id="address"
              type="text"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("address", {
                required: "Street address is required",
                minLength: { value: 5, message: "Address is too short" },
              })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city">City:</label>
            <input
              id="city"
              type="text"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("city", {
                required: "City is required",
              })}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="province">Province:</label>
            <input
              id="province"
              type="text"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("province", {
                required: "Province is required",
              })}
            />
            {errors.province && (
              <p className="text-sm text-red-500">{errors.province.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              id="postalCode"
              type="text"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("postalCode", {
                required: "Postal code is required",
                pattern: {
                  value: /^[0-9]{4,6}$/,
                  message: "Postal code must be 4-6 digits",
                },
              })}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("country", {
                required: "Country is required",
              })}
            >
              <option value="">Select a country</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
            </select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="primaryPhone">Primary Telephone Number:</label>
            <input
              id="primaryPhone"
              type="tel"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("primaryPhone", {
                required: "Primary phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
            />
            {errors.primaryPhone && (
              <p className="text-sm text-red-500">
                {errors.primaryPhone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="secondaryPhone">
              Secondary Telephone Number (Optional):
            </label>
            <input
              id="secondaryPhone"
              type="tel"
              className="block w-full rounded-md bg-gray-100 p-2 ring-1 ring-gray-300"
              {...register("secondaryPhone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
            />
            {errors.secondaryPhone && (
              <p className="text-sm text-red-500">
                {errors.secondaryPhone.message}
              </p>
            )}
          </div>

          <h2 className="mt-10 mb-4 text-2xl font-bold">Payment Method</h2>

          <div className="flex flex-col gap-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
              <input
                type="radio"
                value="cod"
                {...register("paymentMethod", {
                  required: "Please select a payment method",
                })}
                className="accent-green-600"
              />
              <BsCashCoin />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
              <input
                type="radio"
                value="card"
                {...register("paymentMethod", {
                  required: "Please select a payment method",
                })}
                className="accent-blue-600"
              />
              <LuCreditCard />
              <span>Card Payment</span>
            </label>
          </div>

          {errors.paymentMethod && (
            <p className="text-sm text-red-500">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        <div>
          <h2 className="mt-8 mb-4 text-2xl font-bold">Order Summery</h2>

          <div>
            <p className="font-bold">Estimated Delivery</p>
            <p className="text-gray-600">{getDeliveryDate()}</p>
          </div>

          <div className="mt-6 space-y-2">
            {cartItems.map((item) => (
              <div
                className="flex items-center justify-between gap-6 rounded-md bg-gray-50 p-2"
                key={item.productId}
              >
                <div className="flex items-center gap-6">
                  <img src={item.image} alt="" className="size-12" />
                  <p>{item.name}</p>
                </div>
                <p className="min-w-10">x {item.qty}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 mb-4 space-y-2 rounded-xl bg-white p-8 ring-1 ring-gray-300">
            <h2 className="mb-6 text-center text-xl">Order Summery</h2>

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
              type="submit"
              className="ring-accent text-font hover:bg-accent mt-6 block w-full cursor-pointer rounded-md bg-white p-3 ring-1 transition hover:text-white"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CheckoutPage;
