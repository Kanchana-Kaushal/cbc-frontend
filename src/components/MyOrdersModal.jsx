import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiX,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import Modal from "react-modal";

function MyOrderModal(props) {
  const {
    selectedOrder,
    setIsLoading,
    setIsOpen,
    setSelectedOrder,
    formatPrice,
    formatDate,
    getStatusColor,
    calculateOrderTotal,
    modalIsOpen,
    token,
  } = props;

  Modal.setAppElement("#root");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      border: "none",
      borderRadius: "12px",
      maxWidth: "95vw",
      maxHeight: "95vh",

      overflow: "hidden",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  function closeModal() {
    setIsOpen(false);
    setSelectedOrder(null);
  }

  const handleCancelOrder = async (orderId) => {
    const loadingToastId = toast.loading("Cacellling...");
    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/orders/update/" + orderId,
        { status: "cancelled" },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      toast.success("Order cancelled successfully", { id: loadingToastId });
      closeModal();
      setIsLoading(true);
    } catch (err) {
      console.log(err);

      toast.error("Failed to cancel order", { id: loadingToastId });
    }
  };

  const handleConfirmReceived = async (orderId) => {
    const loadingToastId = toast.loading("Confirming...");
    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/orders/update/" + orderId,
        { status: "delivered" },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      toast.success("Order marked as received", { id: loadingToastId });
      closeModal();
      setIsLoading(true);
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm order received", { id: loadingToastId });
    }
  };

  return (
    <>
      {" "}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Order Details"
      >
        {selectedOrder && (
          <div className="mx-auto w-full max-w-2xl bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedOrder.order.orderId}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
              {/* Order Status and Info */}
              <div className="mb-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedOrder.order.status)}`}
                  >
                    {selectedOrder.order.status.charAt(0).toUpperCase() +
                      selectedOrder.order.status.slice(1)}
                  </span>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(calculateOrderTotal(selectedOrder.products))}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>
                      Ordered: {formatDate(selectedOrder.order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-gray-400" />
                    <span>
                      Payment: {selectedOrder.order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Delivery Information
                </h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <span className="font-medium">
                      {selectedOrder.order.deliveryDetails.recieversName}
                    </span>
                  </div>
                  <div className="mb-3 flex items-start gap-2">
                    <FiMapPin className="mt-0.5 text-gray-400" />
                    <div>
                      <p>
                        {selectedOrder.order.deliveryDetails.address.street}
                      </p>
                      <p>
                        {selectedOrder.order.deliveryDetails.address.city},{" "}
                        {selectedOrder.order.deliveryDetails.address.province}
                      </p>
                      <p>
                        {selectedOrder.order.deliveryDetails.address.postalCode}
                        , {selectedOrder.order.deliveryDetails.address.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <span>{selectedOrder.order.deliveryDetails.tel}</span>
                    </div>
                    {selectedOrder.order.deliveryDetails.tel02 && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        <span>{selectedOrder.order.deliveryDetails.tel02}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Items ({selectedOrder.products.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="line-clamp-2 font-medium text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Brand: {product.brand}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Qty: {product.qty}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(product.priceCents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
                {selectedOrder.order.status.toLowerCase() === "pending" && (
                  <button
                    onClick={() =>
                      handleCancelOrder(selectedOrder.order.orderId)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
                {selectedOrder.order.status.toLowerCase() === "in-transit" && (
                  <button
                    onClick={() =>
                      handleConfirmReceived(selectedOrder.order.orderId)
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    Confirm Received
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default MyOrderModal;
