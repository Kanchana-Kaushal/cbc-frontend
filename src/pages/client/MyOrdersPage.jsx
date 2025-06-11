import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiCalendar, FiMapPin, FiCreditCard } from "react-icons/fi";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    (async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL +
            "/api/orders/" +
            user.userId +
            "/my-orders",
          { headers: { Authorization: "Bearer " + token } },
        );

        setOrders(response.data.data.orders);
      } catch (err) {
        toast.error(err.response.data.error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (priceCents) => {
    return `$. ${(priceCents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateOrderTotal = (products) => {
    return products.reduce(
      (total, product) => total + product.priceCents * product.qty,
      0,
    );
  };

  return (
    <>
      <main className="min-h-screen">
        {isLoading ? (
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
          </div>
        ) : (
          <>
            {orders.length === 0 ? (
              <div className="flex min-h-screen items-center justify-center">
                <div className="space-y-4 rounded-md p-8 text-center">
                  <h1 className="text-2xl font-semibold">
                    There is no item to show you right now :(
                  </h1>
                  <p className="text-gray-600">
                    Place some orders to track your order status here.
                  </p>

                  <button
                    className="ring-accent hover:bg-accent mt-2 w-fit cursor-pointer rounded-md bg-white px-4 py-2 ring-1 hover:text-white"
                    onClick={() => {
                      navigate("/shop");
                    }}
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className="container mx-auto max-w-4xl px-4 py-8 pt-20">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-gray-600">View and track your orders</p>
                </div>

                {/* Orders Grid */}
                <div className="grid gap-4 md:gap-6">
                  {orders.map((orderData, index) => {
                    const { order, products } = orderData;
                    const orderTotal = calculateOrderTotal(products);

                    return (
                      <div
                        key={order._id}
                        className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                        onClick={() => {
                          // Handle order selection - navigate to order details
                          console.log("Selected order:", order.orderId);
                        }}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          {/* Left side - Order info */}
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <FiPackage className="text-lg text-gray-500" />
                              <h3 className="font-semibold text-gray-900">
                                {order.orderId}
                              </h3>
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                              <div className="flex items-center gap-2">
                                <FiCalendar className="text-gray-400" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiMapPin className="text-gray-400" />
                                <span>
                                  {order.deliveryDetails.address.city}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiCreditCard className="text-gray-400" />
                                <span>{order.paymentMethod.toUpperCase()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiPackage className="text-gray-400" />
                                <span>
                                  {products.length} item
                                  {products.length > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right side - Total and products preview */}
                          <div className="flex flex-col gap-3 sm:items-end">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(orderTotal)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Total amount
                              </p>
                            </div>

                            {/* Product images preview */}
                            <div className="flex -space-x-2">
                              {products.slice(0, 3).map((product, idx) => (
                                <img
                                  key={idx}
                                  src={product.image}
                                  alt={product.name}
                                  className="ring-accent h-8 w-8 rounded-full border-2 border-white object-cover ring-1"
                                />
                              ))}
                              {products.length > 3 && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600">
                                  +{products.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default MyOrdersPage;
