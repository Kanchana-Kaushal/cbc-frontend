import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdOutlineShoppingBag, MdSearch, MdHourglassTop } from "react-icons/md";

function OrdersPage() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      (async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderStatus}?query=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setOrders(data.data.orders || []);

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
    }, 300);

    return () => clearTimeout(timeOut);
  }, [query, orderStatus]);

  return (
    <>
      <main className="min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders ({orders.length})</h1>

          <div className="mt-6 w-1/3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                <MdSearch className="h-4 w-4 text-gray-500 md:h-5 md:w-5" />
              </div>
              <input
                type="text"
                placeholder="Search Orders..."
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none md:py-3 md:pr-5 md:pl-12 md:text-base"
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                  setIsSearching(true);
                }}
              />
            </div>
          </div>
        </div>
        <hr className="my-6" />

        <div>
          {isLoading ? (
            <div className="mt-50 flex h-full w-full items-center justify-center">
              <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
            </div>
          ) : (
            <>
              {isSearching ? (
                <div className="flex w-full items-center justify-center pt-15">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <MdHourglassTop className="h-8 w-8 animate-bounce text-blue-600 md:h-10 md:w-10" />
                    </div>
                    <p className="animate-pulse text-sm font-medium text-gray-700">
                      Finding Orders...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex w-full items-center justify-between">
                    <button
                      className={`w-full cursor-pointer ring-1 ring-gray-300 transition hover:bg-blue-400 hover:text-white ${orderStatus === "pending" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        setOrderStatus("pending");
                      }}
                    >
                      Pending
                    </button>
                    <button
                      className={`w-full cursor-pointer ring-1 ring-gray-300 transition hover:bg-blue-400 hover:text-white ${orderStatus === "confirmed" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        setOrderStatus("confirmed");
                      }}
                    >
                      Confirmed
                    </button>
                    <button
                      className={`w-full cursor-pointer ring-1 ring-gray-300 transition hover:bg-blue-400 hover:text-white ${orderStatus === "in-transit" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        setOrderStatus("in-transit");
                      }}
                    >
                      In Transit
                    </button>
                    <button
                      className={`w-full cursor-pointer ring-1 ring-gray-300 transition hover:bg-blue-400 hover:text-white ${orderStatus === "delivered" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        setOrderStatus("delivered");
                      }}
                    >
                      Delivered
                    </button>
                    <button
                      className={`w-full cursor-pointer ring-1 ring-gray-300 transition hover:bg-blue-400 hover:text-white ${orderStatus === "cancelled" ? "bg-blue-400 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        setOrderStatus("cancelled");
                      }}
                    >
                      Cancelled
                    </button>
                  </div>

                  {orders.length > 0 ? (
                    <>
                      {" "}
                      <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-lg">
                        <thead className="bg-gray-100">
                          <tr>
                            {[
                              "Order ID",
                              "Created At",
                              "Products Count",
                              "Payment Method",
                              "Location",
                            ].map((header) => (
                              <th
                                key={header}
                                className="px-6 py-3 text-center text-sm font-semibold tracking-wider text-gray-700 uppercase"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {orders.map((order) => {
                            const {
                              orderId,
                              createdAt,
                              deliveryDetails,
                              products,
                              paymentMethod,
                            } = order;

                            const city =
                              deliveryDetails?.address?.city || "Unknown";
                            const country =
                              deliveryDetails?.address?.country || "Unknown";

                            return (
                              <tr
                                key={orderId}
                                className="cursor-pointer transition hover:bg-gray-50"
                                onClick={() => {
                                  navigate("/admin/order-info", {
                                    state: { orderId },
                                  });
                                }}
                              >
                                <td className="px-6 py-4 text-center text-sm text-gray-700">
                                  {orderId}
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-700">
                                  {new Date(createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-700">
                                  {products.length}
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-700">
                                  {paymentMethod?.toUpperCase()}
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-700">
                                  {`${city}/${country}`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      {/* Empty State */}
                      {orders.length === 0 && (
                        <div className="col-span-5 py-12 text-center md:py-20">
                          <div className="mb-3 text-gray-400 md:mb-4">
                            <MdOutlineShoppingBag className="mx-auto text-4xl md:text-6xl" />
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-gray-600 md:mb-2 md:text-xl">
                            No orders found
                          </h3>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default OrdersPage;
