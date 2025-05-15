import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes path="/*">
          <Route path="/*" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
