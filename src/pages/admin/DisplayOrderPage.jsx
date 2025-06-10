import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function DisplayOrderPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const location = useLocation();
  const orderId = location.state?.orderId;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders/order/" + orderId,
          {
            headers: { Authorization: "Bearer " + token },
          },
        );
        setOrderData(response.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [isLoading]);

  async function updateOrder(status) {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/orders/update/" + orderId,
        { status },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      setIsLoading(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
      </div>
    );
  }

  if (!orderData || !orderData.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const { order, products, user } = orderData.data.order;
  const orderDetails = order;

  const getNextOrderAction = () => {
    const currentOrderStatus = order.status;
    let nextOrderStatus;

    if (currentOrderStatus === "pending") {
      nextOrderStatus = "confirmed";
    } else if (currentOrderStatus === "confirmed") {
      nextOrderStatus = "in-transit";
    }

    return nextOrderStatus;
  };

  const nextOrderStatus = getNextOrderAction();

  // Calculate total price
  const totalPrice = products.reduce(
    (total, product) => total + product.priceCents * product.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Order Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Order #{orderDetails.orderId}
                </h2>
                <p className="text-blue-100">
                  Placed on {formatDate(orderDetails.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    orderDetails.status === "pending"
                      ? "bg-yellow-500"
                      : orderDetails.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-green-500"
                  }`}
                >
                  {orderDetails.status.charAt(0).toUpperCase() +
                    orderDetails.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Customer Info Section */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {/* Customer Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <span className="mr-2">👤</span>
                  Customer Information
                </h3>
                <div className="mb-3 flex items-center">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="mr-3 h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <span className="mr-2">📍</span>
                  Delivery Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {orderDetails.deliveryDetails.recieversName}
                  </p>
                  <p>{orderDetails.deliveryDetails.address.street}</p>
                  <p>
                    {orderDetails.deliveryDetails.address.city},{" "}
                    {orderDetails.deliveryDetails.address.province}
                  </p>
                  <p>
                    {orderDetails.deliveryDetails.address.postalCode},{" "}
                    {orderDetails.deliveryDetails.address.country}
                  </p>
                  <p className="text-gray-600">
                    📞 {orderDetails.deliveryDetails.tel}
                  </p>
                  {orderDetails.deliveryDetails.tel02 && (
                    <p className="text-gray-600">
                      📞 {orderDetails.deliveryDetails.tel02}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 flex items-center text-lg font-semibold text-gray-800">
                  <span className="mr-2">💳</span>
                  Payment Method
                </h3>
                <p className="font-medium text-green-700">
                  {orderDetails.paymentMethod.toUpperCase() === "COD"
                    ? "Cash on Delivery"
                    : orderDetails.paymentMethod}
                </p>
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                <span className="mr-2">🛍️</span>
                Ordered Items ({products.length})
              </h3>

              <div className="space-y-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Brand: {product.brand}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          Category: {product.category.replace("_", " & ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Qty: {product.qty}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {formatPrice(product.priceCents)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between text-xl font-bold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Order Button */}
            <div className="mt-8 flex justify-center gap-8 text-center">
              {nextOrderStatus === "confirmed" && (
                <button
                  className="transform rounded-lg bg-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors duration-200 hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => {
                    updateOrder("cancelled");
                  }}
                >
                  Cancel Order
                </button>
              )}

              {nextOrderStatus && (
                <button
                  className="transform rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors duration-200 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                  onClick={() => {
                    updateOrder(nextOrderStatus);
                  }}
                >
                  Set as {nextOrderStatus}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayOrderPage;
