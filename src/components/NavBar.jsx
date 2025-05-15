import { useState } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

function NavBar() {
  const [isMenuShown, setIsMenuShown] = useState(false);

  function toggleMenu() {
    setIsMenuShown((prev) => !prev);
  }

  return (
    <nav className="fixed z-50 w-full backdrop-blur-xl">
      <div className="mx-auto my-4 flex w-9/10 max-w-[1440px] items-center justify-between md:w-8/10">
        {isMenuShown ? (
          <IoMdClose className="z-50 size-7 md:hidden" onClick={toggleMenu} />
        ) : (
          <GiHamburgerMenu
            className="z-50 size-7 md:hidden"
            onClick={toggleMenu}
          />
        )}

        <img src="/logo.png" alt="cbc logo" className="z-50 w-1/2 max-w-50" />
        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-lg font-semibold tracking-wide text-gray-800 md:flex">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">Shop</li>
            <li className="cursor-pointer">Catagories</li>
            <li className="cursor-pointer">About</li>
          </ul>

          <MdOutlineShoppingBag className="text-3xl text-gray-800" />

          <FaUserCircle className="hidden text-3xl text-gray-800 md:flex" />
        </div>
      </div>

      {isMenuShown && (
        <div className="absolute top-0 min-h-screen w-full bg-gray-100">
          <div className="mx-auto w-9/10 pt-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-800 uppercase">
                  Kanchana Kaushal
                </p>
                <p className="text-sm text-gray-500">
                  kanchanakaushal200@gmail.com
                </p>
              </div>
              <FaUserCircle className="text-5xl text-gray-800" />
            </div>

            <hr className="my-6 text-gray-500" />

            <ul className="space-y-6 text-xl font-bold text-gray-800 uppercase">
              <li>Home</li>
              <li>Skincare</li>
              <li>Haircare</li>
              <li>Fragrance</li>
              <li>Accessories</li>
              <li>Bath & Body</li>
              <li>Accessories</li>
              <li>Gift Sets</li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
