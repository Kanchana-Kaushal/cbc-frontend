import { Route, Routes } from "react-router";
import NavBar from "../components/NavBar";
import Home from "./client/Home";
import Auth from "./client/Auth";

function MainPage() {
  return (
    <>
      <NavBar />

      <div>
        <Routes path="/*">
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </>
  );
}

export default MainPage;
