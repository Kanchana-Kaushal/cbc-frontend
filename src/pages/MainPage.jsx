import { Route, Routes } from "react-router";
import NavBar from "../components/NavBar";
import Home from "./client/Home";
import Auth from "./client/Auth";
import ShopPage from "./client/ShopPage";
import SingleProdPage from "./client/SingleProdPage";

function MainPage() {
  return (
    <>
      <NavBar />

      <div className="font-lato bg-primary text-font">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<SingleProdPage />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </>
  );
}

export default MainPage;
