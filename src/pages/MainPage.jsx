import { Route, Routes } from "react-router";
import NavBar from "../components/NavBar";
import Home from "./client/Home";
import Auth from "./client/Auth";
import ShopPage from "./client/ShopPage";
import SingleProdPage from "./client/SingleProdPage";
import CartPage from "./client/CartPage";
import CheckoutPage from "./client/CheckoutPage";
import MyOrdersPage from "./client/MyOrdersPage";
import Footer from "../components/Footer";
import VerifyEmailPage from "./client/VerifyEmailPage";
import ForgotPasswordPage from "./client/ForgotPasswordPage";
import AboutPage from "./client/AboutPage";
import CustomShopPage from "./client/CustomShopPage";

function MainPage() {
  return (
    <>
      <NavBar />

      <div className="font-lato bg-primary text-font">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:type/:criteria" element={<CustomShopPage />} />
          <Route path="/product/:id" element={<SingleProdPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/verify" element={<VerifyEmailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default MainPage;
