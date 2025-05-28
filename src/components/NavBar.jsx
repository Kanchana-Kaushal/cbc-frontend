import { useState } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

function NavBar() {
  const [isMenuShown, setIsMenuShown] = useState(false);

  function toggleMenu() {
    setIsMenuShown((prev) => !prev);
  }

  return (
    <nav className="fixed z-50 w-full backdrop-blur-xl">
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

        <Link to={"/home"} className="cursor-pointer">
          <img src="/logo.png" alt="cbc logo" className="z-50 max-w-50" />
        </Link>

        <div className="flex items-center md:gap-8">
          <ul className="hidden items-center gap-8 text-lg font-semibold tracking-wide text-gray-800 md:flex">
            <li className="group relative cursor-pointer">
              <Link to={"/home"} className="cursor-pointer">
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

          <Link to={"/auth"} className="group relative cursor-pointer">
            <LuUser className="hidden text-3xl text-gray-800 md:flex" />
            <span className="bg-accent absolute -bottom-4.5 left-0 min-h-1.5 w-full opacity-0 group-hover:opacity-100" />
          </Link>
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
                    Kanchana Kaushal
                  </p>
                  <p className="text-sm text-gray-500">
                    kanchanakaushal200@gmail.com
                  </p>
                </div>
                <FaUserCircle className="text-5xl text-gray-800" />
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
