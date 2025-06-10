import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function OrdersPage() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders/" + orderStatus,
          {
            headers: { Authorization: "Bearer " + token },
          },
        );

        setOrders(response.data.data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [orderStatus]);

  return (
    <>
      <main className="min-h-screen">
        <h1 className="text-3xl font-bold">Orders</h1>
        <hr className="mt-4 mb-4" />
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

        <div>
          {isLoading ? (
            <div className="mt-50 flex h-full w-full items-center justify-center">
              <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
            </div>
          ) : (
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

                  const city = deliveryDetails?.address?.city || "Unknown";
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
          )}
        </div>
      </main>
    </>
  );
}

export default OrdersPage;
