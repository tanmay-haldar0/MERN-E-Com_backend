import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./server.js";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ActivationPage from "./pages/ActivationPage.jsx";
import { ToastContainer, Bounce } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css"
import SellerSignUpPage from "./pages/SellerSignUpPage.jsx";
import SellerActivationPage from "./pages/SellerActivationPage.jsx";
import SellerLoginPage from "./pages/SellerLoginPage.jsx";

function App() {
  
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/seller/signup" element={<SellerSignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/dashboard" element={<AccountPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </Router>
    </div>
  );
}

export default App;
