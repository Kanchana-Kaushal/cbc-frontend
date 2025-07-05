import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdHourglassTop } from "react-icons/md";

function ProductsPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      (async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/search?query=${query}`,
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

          if (isSearching === true) {
            setIsSearching(false);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }, 300);

    return () => clearTimeout(timeOut);
  }, [query, isLoading]);

  /* Delete Function */
  const deleteProduct = async (productId) => {
    const loadingToastId = toast.loading("Loading...");
    try {
      const response = await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      toast.success("Product deleted successfully", { id: loadingToastId });
      setIsLoading(true);
    } catch (error) {
      toast.error(error.response.data.message, { id: loadingToastId });
    }
  };

  return (
    <>
      <section className="relative">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>

          <div className="mt-6 w-1/3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
                <MdSearch className="h-4 w-4 text-gray-500 md:h-5 md:w-5" />
              </div>
              <input
                type="text"
                placeholder="Search Products..."
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none md:py-3 md:pr-5 md:pl-12 md:text-base"
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                  setIsSearching(true);
                }}
              />
            </div>
          </div>
        </div>
        <hr className="mt-4 mb-8" />

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
                    Finding Products...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {products.length > 0 ? (
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
                      {products.map((product) => {
                        const {
                          productId,
                          images,
                          name,
                          inventory,
                          priceInfo,
                        } = product;
                        const isAvailable = inventory.available;
                        const stock = inventory.stockLeft;
                        const price = (
                          priceInfo?.sellingPriceCents / 100
                        ).toFixed(2);

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
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {productId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <img
                                src={images[0]}
                                alt="product"
                                className="size-15 object-cover object-center"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {stock}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              ${price}
                            </td>
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
                                <button
                                  className="size-7 cursor-pointer transition hover:text-red-600"
                                  onClick={() => {
                                    deleteProduct(product._id);
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <>
                    {/* Empty State */}
                    {products.length === 0 && (
                      <div className="col-span-5 py-12 text-center md:py-20">
                        <h3 className="mb-1 text-lg font-semibold text-gray-600 md:mb-2 md:text-xl">
                          No products found
                        </h3>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
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
