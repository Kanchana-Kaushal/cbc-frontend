import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ProductsPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    })();
  }, [isLoading, token]);

  const tableContent = products.map((product) => {
    const { productId, images, name, inventory, priceInfo } = product;
    const isAvailable = inventory.available;
    const stock = inventory.stockLeft;
    const price = (priceInfo.sellingPriceCents / 100).toFixed(2);

    return (
      <tr
        key={productId}
        className="cursor-pointer transition hover:bg-gray-50"
      >
        <td className="px-6 py-4">
          <div
            className={`ml-4 h-3 w-3 rounded-full ${
              isAvailable ? "bg-green-600" : "bg-red-600"
            }`}
          />
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">{productId}</td>
        <td className="px-6 py-4 text-sm text-gray-700">
          <img
            src={images[0]}
            alt="product"
            className="size-15 object-cover object-center"
          />
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">{name}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{stock}</td>
        <td className="px-6 py-4 text-sm text-gray-700">${price}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-6 text-gray-600">
            <button
              className="size-7 cursor-pointer transition hover:text-blue-600"
              onClick={() => {
                navigate("/admin/edit-products", {
                  state: product,
                });
              }}
            >
              <FaEdit />
            </button>
            <button className="size-7 cursor-pointer transition hover:text-red-600">
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <section className="relative">
        <h1 className="text-3xl font-bold">Products</h1>
        <hr className="mt-4 mb-8" />

        {isLoading ? (
          <div className="mt-50 flex h-full w-full items-center justify-center">
            <div className="h-[70px] w-[70px] animate-spin rounded-full border-[5px] border-gray-300 border-t-blue-900" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Status",
                  "Product ID",
                  "Image",
                  "Name",
                  "Qty",
                  "Price",
                  "Options",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tableContent}
            </tbody>
          </table>
        )}
      </section>

      <div
        className="absolute top-[80%] right-20 min-h-16 min-w-16 cursor-pointer rounded-full bg-blue-500 drop-shadow-2xl transition-transform hover:scale-110"
        onClick={() => navigate("/admin/add-products")}
      >
        <IoAdd className="size-16 text-white" />
      </div>
    </>
  );
}

export default ProductsPage;
