import { useEffect, useState } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { deleteMedia, uploadMedia } from "../utils/supabase";
import axios from "axios";
import toast from "react-hot-toast";

function NavBar() {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [userPopupShown, setUserPopupShown] = useState(false);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const LocalUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(LocalUser);
  }, [isMenuShown, userPopupShown]);

  const username = user?.username || "User";
  const email = user?.email || "Please sign in to see your details";
  const userId = user?.userId || null;
  const avatar = user?.avatar || null;
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    const loadingToastId = toast.loading("Updating Avatar...");

    if (selectedFile) {
      try {
        const url = await uploadMedia(selectedFile);
        const existingAvatarUrl = avatar;

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/user/${userId}/update-user`,
          { avatar: url },
          { headers: { Authorization: "Bearer " + token } },
        );

        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        setUser(JSON.parse(localStorage.getItem("user")));
        toast.success("Avatar updated successfully", { id: loadingToastId });
        deleteMedia(existingAvatarUrl);
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Could not update the avatar",
          {
            id: loadingToastId,
          },
        );
      }
    }
  };

  function toggleMenu() {
    setIsMenuShown((prev) => !prev);
  }

  function toggleUserPopup() {
    setUserPopupShown((prev) => !prev);
  }

  return (
    <nav className="fixed z-50 w-full backdrop-blur-3xl">
      <div className="mx-auto my-4 flex w-9/10 max-w-[1440px] items-center justify-between md:w-8/10">
        <motion.div
          animate={{ rotate: isMenuShown ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="z-50 md:hidden"
        >
          {isMenuShown ? (
            <IoMdClose className="z-50 size-7 md:hidden" onClick={toggleMenu} />
          ) : (
            <GiHamburgerMenu
              className="z-50 size-7 md:hidden"
              onClick={toggleMenu}
            />
          )}
        </motion.div>

        <Link to={"/"} className="cursor-pointer">
          <img src="/logo.png" alt="cbc logo" className="z-50 max-w-50" />
        </Link>

        <div className="flex items-center md:gap-8">
          <ul className="hidden items-center gap-8 text-lg font-semibold tracking-wide text-gray-800 md:flex">
            <li className="group relative cursor-pointer">
              <Link to={"/"} className="cursor-pointer">
                Home
              </Link>
              <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
            </li>

            <li className="group relative cursor-pointer">
              <Link to={"/shop"} className="cursor-pointer">
                Shop
              </Link>
              <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
            </li>

            <li className="group relative cursor-pointer">
              <Link to={"/about"} className="cursor-pointer">
                About
              </Link>
              <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
            </li>
          </ul>

          <Link to={"/cart"} className="group relative cursor-pointer">
            <MdOutlineShoppingBag className="text-3xl text-gray-800" />
            <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
          </Link>

          {user ? (
            <div className="relative">
              <img
                src={avatar}
                className="hidden size-10 cursor-pointer rounded-full object-cover object-center md:block"
                onClick={toggleUserPopup}
              />

              {/* User Popup */}
              <AnimatePresence>
                {userPopupShown && (
                  <motion.div
                    className="animate-fade-in absolute top-14 right-4 w-72 rounded-xl bg-white shadow-lg ring-1 ring-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <IoMdClose
                      className="absolute top-3 right-3 cursor-pointer text-2xl text-gray-500 hover:text-gray-900"
                      onClick={() => {
                        setUserPopupShown(false);
                      }}
                    />
                    <div className="flex flex-col items-center px-6 py-5">
                      <div className="relative">
                        <img
                          src={avatar}
                          alt="User Avatar"
                          className="h-20 w-20 rounded-full border border-gray-300 object-cover shadow-sm"
                        />

                        <label htmlFor="avatar">
                          <div className="absolute top-0 -right-2 cursor-pointer rounded-full bg-blue-500 p-1 text-xl text-white hover:text-gray-900">
                            <RiPencilFill />
                          </div>
                          <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            accept="image/*"
                            multiple={false}
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-base font-semibold text-gray-900">
                          {username}
                        </p>
                        <p className="text-sm text-gray-500">{email}</p>
                      </div>
                    </div>

                    <div className="px-6">
                      <Link
                        to="/my-orders"
                        className="hover:bg-accent block w-full rounded-md bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 transition hover:text-white"
                        onClick={() => {
                          setUserPopupShown(false);
                        }}
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/auth"
                        className="mt-2 block w-full rounded-md bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-red-400 hover:text-white"
                        onClick={() => {
                          setUserPopupShown(false);
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                        }}
                      >
                        Log Out
                      </Link>

                      <Link
                        to="/auth"
                        className="mt-3 block text-center text-xs text-gray-400 transition hover:text-gray-600"
                        onClick={() => {
                          setUserPopupShown(false);
                        }}
                      >
                        Use a different account?
                      </Link>
                    </div>

                    <div className="mt-5 border-t border-gray-100" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to={"/auth"} className="group relative cursor-pointer">
              <LuUser className="hidden text-3xl text-gray-800 md:flex" />
              <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMenuShown && (
          <motion.div
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{ ease: "easeOut" }}
            className="absolute top-0 min-h-screen w-full overflow-y-auto bg-white"
          >
            <div className="mx-auto w-9/10 pt-20">
              <div
                className="flex items-center justify-between"
                onClick={toggleMenu}
              >
                <div
                  onClick={() => {
                    navigate("/auth");
                    toggleMenu;
                  }}
                >
                  <p className="text-lg font-bold text-gray-800 capitalize">
                    {username || "Login"}
                  </p>
                  <p className="text-sm text-gray-500">{email || "Login"}</p>
                </div>
                {avatar ? (
                  <div className="relative mr-4">
                    <img
                      src={avatar}
                      alt="User Avatar"
                      className="h-15 w-15 rounded-full border border-gray-300 object-cover object-center shadow-sm"
                      onClick={() => {
                        navigate("/auth");
                        toggleMenu;
                      }}
                    />

                    <label htmlFor="avatar">
                      <div className="absolute -right-3 bottom-0 cursor-pointer rounded-full bg-blue-500 p-1 text-xl text-white hover:text-gray-900">
                        <RiPencilFill />
                      </div>

                      <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        accept="image/*"
                        multiple={false}
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <FaUserCircle className="text-5xl text-gray-800" />
                )}
              </div>

              <hr className="my-6 text-gray-500" />

              <ul className="space-y-4 text-lg font-bold text-gray-800 capitalize">
                <li>
                  <Link
                    to="/my-orders"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    My Orders
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shop"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/category/skincare"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/category/haircare"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Haircare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/category/makeup"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Makeup
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/category/fragrance"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Fragrance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/category/men"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Mens
                  </Link>
                </li>

                <li>
                  <Link
                    to="/about"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    About us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/auth"
                    className="cursor-pointer"
                    onClick={() => {
                      toggleMenu();
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                    }}
                  >
                    Log Out
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavBar;
