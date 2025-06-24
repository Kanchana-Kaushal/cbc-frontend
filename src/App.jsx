import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";
import AdminHome from "./pages/admin/AdminHome";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/*" element={<MainPage />} />
            <Route path="/admin/*" element={<AdminHome />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
