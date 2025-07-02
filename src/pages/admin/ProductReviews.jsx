import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProductReviews() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      (async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setProducts(data.products);

          if (isLoading === true) {
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }, 300);

    return () => clearTimeout(timeOut);
  }, [isLoading]);

  const tableContent = products.map((product) => {
    const { productId, images, name, inventory } = product;
    const isAvailable = inventory.available;
    const reviews = product.reviews;

    if (reviews.length === 0) {
      return undefined;
    }

    return (
      <tr
        key={productId}
        className="cursor-pointer transition hover:bg-gray-50"
        onClick={() => {
          navigate("/admin/manage-reviews", {
            state: { reviews, productId: product._id },
          });
        }}
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
        <td className="px-6 py-4 text-sm text-gray-700">{reviews.length}</td>
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
                {["Status", "Product ID", "Image", "Name", "Reviews"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tableContent}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default ProductReviews;
