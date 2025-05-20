import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProductsPage from "./Products";
import AddProductsPage from "./AddProducts";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/orders");
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="relative h-screen w-2/10 bg-white p-8 drop-shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <img
              src={user.avatar}
              alt="user avatar"
              className="size-15 rounded-full"
            />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.username}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <hr className="mt-4 mb-12" />

          <ul className="space-y-6 text-lg font-semibold">
            <li>
              <Link to={"/admin/orders"}>Orders</Link>
            </li>
            <li>
              <Link to={"/admin/products"}>Products</Link>
            </li>
            <li>
              <Link to={"/admin/users"}>Users</Link>
            </li>
            <li>
              <Link to={"/admin/admins"}>Admins</Link>
            </li>
          </ul>

          <Link to={"/auth"}>
            <p className="absolute bottom-4 left-1/2 w-8/10 -translate-x-1/2 rounded-md bg-red-400 px-4 py-2 text-center text-lg font-semibold text-white hover:bg-red-500">
              Sign Out
            </p>
          </Link>
        </aside>

        <main className="h-screen flex-8/10 overflow-y-scroll bg-gray-50 p-8 inset-shadow-sm">
          <Routes>
            <Route path="/orders" element={<h1>orders</h1>} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-products" element={<AddProductsPage />} />
            <Route path="/users" element={<h1>users</h1>} />
            <Route path="/admins" element={<h1>admins</h1>} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default AdminHome;
