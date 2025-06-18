import { useEffect, useState } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { FaEdit } from "react-icons/fa";
import { deleteMedia, uploadMedia } from "../utils/supabase";
import axios from "axios";
import toast from "react-hot-toast";

function NavBar() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");
  const username = user?.username || "User";
  const email = user?.email || "Please sign in to see your details";
  const userId = user?.userId || null;
  const avatar = user?.avatar || null;

  const [isMenuShown, setIsMenuShown] = useState(false);
  const [userPopupShown, setUserPopupShown] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    if (selectedFile) {
      try {
        const url = await uploadMedia(selectedFile);
        const existingAvatarUrl = avatar;

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/user/${userId}/update-user`,
          { avatar: url },
          { headers: { Authorization: "Bearer " + token } },
        );

        deleteMedia(existingAvatarUrl);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        setIsLoading(true);
        toast.success("Avatar updated successfully");
      } catch (err) {
        toast.error(err.message);
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
              {" "}
              <Link to={"/shop"} className="cursor-pointer">
                Shop
              </Link>
              <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
            </li>

            <li className="group relative cursor-pointer">
              {" "}
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
                className="hidden size-10 cursor-pointer rounded-full md:block"
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
                          <FaEdit className="absolute -right-2 bottom-0 cursor-pointer text-gray-500 hover:text-gray-900" />
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
            className="absolute top-0 min-h-screen w-full bg-white"
          >
            <div className="mx-auto w-9/10 pt-20">
              <Link
                to={"/auth"}
                className="flex items-center justify-between"
                onClick={toggleMenu}
              >
                <div>
                  <p className="text-lg font-bold text-gray-800 uppercase">
                    {username || "Login"}
                  </p>
                  <p className="text-sm text-gray-500">{email || "Login"}</p>
                </div>
                {avatar ? (
                  <div className="relative mr-4">
                    <img
                      src={avatar}
                      alt="User Avatar"
                      className="h-15 w-15 rounded-full border border-gray-300 object-cover shadow-sm"
                    />

                    <label htmlFor="avatar">
                      <FaEdit className="absolute top-0 -right-3 cursor-pointer text-xl text-gray-500 hover:text-gray-900" />
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
              </Link>

              <hr className="my-6 text-gray-500" />

              <ul className="space-y-6 text-xl font-bold text-gray-800 uppercase">
                <li>
                  <Link
                    to="/home"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/skincare"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/haircare"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Haircare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/fragrance"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Fragrance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/accessories"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/bath-body"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Bath & Body
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop/gift-sets"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Gift Sets
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
