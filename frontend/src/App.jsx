import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./server.js";
import Navbar from "./Components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import SellerAccountPage from "./pages/SellerAccountPage.jsx";
import ActivationPage from "./pages/ActivationPage.jsx";
import { ToastContainer, Bounce, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import SellerSignUpPage from "./pages/SellerSignUpPage.jsx";
import SellerActivationPage from "./pages/SellerActivationPage.jsx";
import SellerLoginPage from "./pages/SellerLoginPage.jsx";
import { useSelector } from "react-redux";
import { loadSeller, loadUser } from "./redux/actions/user.js";
import store from "./redux/store.js";
import LoadingScreen from "./Components/Loading.jsx";

function RedirectWithToast({ message, to }) {
  useEffect(() => {
    toast.error(message);
  }, []);

  return <Navigate to={to} />;
}

function App() {
  const { isAuthenticated, role, loading } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated || state.seller.isAuthenticated,
    role: state.user.role || state.seller.role,
    loading: state.user.loading || state.seller.loading,
  }));

  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSeller());

    // Delay setting `delayedLoading` to false
    const timeout = setTimeout(() => {
      setDelayedLoading(false);
    }, 500); // Wait for 500ms

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  if (loading || delayedLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/seller/signup" element={<SellerSignUpPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                role === "seller" ? (
                  <Navigate to="/seller/login" />
                ) : (
                  <RedirectWithToast message="You are already logged in." to="/" />
                )
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/seller/login"
            element={
              isAuthenticated ? (
                role === "user" ? (
                  <RedirectWithToast message="You are already logged in." to="/" />
                ) : (
                  <Navigate to="/seller/login" />
                )
              ) : (
                <SellerLoginPage />
              )
            }
          />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                role === "user" ? (
                  <AccountPage />
                ) : (
                  <Navigate to="/seller/dashboard" />
                )
              ) : (
                <RedirectWithToast message="You are not logged in." to="/login" />
              )
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              isAuthenticated ? (
                role === "seller" ? (
                  <SellerAccountPage />
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <RedirectWithToast message="You are not logged in." to="/seller/login" />
              )
            }
          />

          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
