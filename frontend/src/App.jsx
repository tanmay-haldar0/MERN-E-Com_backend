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
import SignUpPage from "./pages/User/SignUpPage.jsx";
import LoginPage from "./pages/User/LoginPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AccountPage from "./pages/User/AccountPage.jsx";
// import SellerAccountPage from "./pages/Seller/SellerAccountPage.jsx";
import ActivationPage from "./pages/User/ActivationPage.jsx";
import { ToastContainer, Bounce, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import SellerSignUpPage from "./pages/Seller/SellerSignUpPage.jsx";
import SellerActivationPage from "./pages/Seller/SellerActivationPage.jsx";
import SellerLoginPage from "./pages/Seller/SellerLoginPage.jsx";
import { useSelector } from "react-redux";
import { loadSeller, loadUser } from "./redux/actions/user.js";
import store from "./redux/store.js";
import LoadingScreen from "./Components/Loading.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import CreateProduct from "./pages/Seller/CreateProduct.jsx";
import AllProducts from "./pages/Seller/AllProducts.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Orders from "./pages/Seller/Orders.jsx";
import Analytics from "./pages/Seller/Analytics.jsx";
import ProfileSettings from "./pages/Seller/ProfileSettings.jsx";

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
          <Route
            path="/seller"
            element={
              isAuthenticated ? (
                role === "seller" ? (
                  <Navigate to="/seller/dashboard" />
                ) : (
                  <RedirectWithToast message="You are not a seller." to="/" />
                )
              ) : (
                <Navigate to="/seller/login" />
              )
            }/>
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
                  <RedirectWithToast message="You are already logged in." to="/seller/dashboard"/>
                  
                )
              ) : (
                <SellerLoginPage />
              )
            }
          />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/seller/orders" element={<Orders />} />
          <Route path="/seller/analytics" element={<Analytics />} />
          <Route path="/seller/profile" element={<ProfileSettings />} />

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
                  <SellerDashboard />
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
          <Route path="/seller/create-product" element={<CreateProduct />} />
          <Route path="/seller/all-products" element={<AllProducts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
