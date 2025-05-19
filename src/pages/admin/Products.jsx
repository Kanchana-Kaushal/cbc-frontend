import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

function Products() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/products/",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      setProducts(response.data.data.products);

      toast.success("Products fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const tableContent = products.map((product) => (
    <tr
      key={product.productId}
      className="cursor-pointer transition hover:bg-gray-50"
    >
      <td className="px-6 py-4">
        {product.inventory.available === "true" ? (
          <div className="ml-4 h-3 w-3 rounded-full bg-red-600"></div>
        ) : (
          <div className="ml-4 h-3 w-3 rounded-full bg-green-600"></div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{product.productId}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <img
          src={product.images[0]}
          alt="product image"
          className="size-15 object-cover object-center"
        />
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {product.inventory.stockLeft}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        ${(product.priceInfo.sellingPriceCents / 100).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-6 text-gray-600">
          <button className="size-7 cursor-pointer transition hover:text-blue-600">
            <FaEdit />
          </button>

          <button className="size-7 cursor-pointer transition hover:text-red-600">
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <section className="relative">
        <h1 className="text-3xl font-bold">Products</h1>
        <hr className="mt-4 mb-8" />

        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Options
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {tableContent}
          </tbody>
        </table>
      </section>

      <div className="absolute top-8/10 right-20 min-h-16 min-w-16 cursor-pointer rounded-full bg-blue-500 drop-shadow-2xl transition-transform ease-in-out hover:scale-110">
        <IoAdd className="size-16 text-white" />
      </div>
    </>
  );
}

export default Products;
