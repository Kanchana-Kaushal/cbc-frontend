import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";
import AdminHome from "./pages/admin/AdminHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/*" element={<MainPage />} />
          <Route path="/admin/*" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
