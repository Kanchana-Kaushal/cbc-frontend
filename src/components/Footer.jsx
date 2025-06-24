import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Grid layout for all content */}
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          {/* Logo + Description */}
          <div>
            <div className="mb-4 flex justify-center md:justify-start">
              <img src="/logo-inverted.png" alt="Logo" className="w-8/10" />
            </div>
            <p className="mx-auto max-w-sm text-sm leading-relaxed opacity-90 md:mx-0 md:mt-8">
              Crystal Beauty Clear brings you high-quality beauty products for
              every skin tone, every occasion, and every confident soul.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Glow Avenue, Colombo, Sri Lanka</li>
              <li>📞 +94 71 234 5678</li>
              <li>✉️ hello@crystalbeautyclear.com</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/20" />

        {/* Bottom section with copyright + icons */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm opacity-70 md:text-left">
            © {new Date().getFullYear()} Crystal Beauty Clear. All rights
            reserved.
          </p>

          <div className="flex space-x-4 text-lg text-white">
            <a href="#">
              <FaFacebookF className="transition hover:opacity-80" />
            </a>
            <a href="#">
              <FaInstagram className="transition hover:opacity-80" />
            </a>
            <a href="#">
              <FaTwitter className="transition hover:opacity-80" />
            </a>
            <a href="#">
              <FaYoutube className="transition hover:opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
