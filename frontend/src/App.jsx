import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import SignUpPage from "./pages/User/SignUpPage.jsx";
import LoginPage from "./pages/User/LoginPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AccountPage from "./pages/User/AccountPage.jsx";
import ActivationPage from "./pages/User/ActivationPage.jsx";
import SellerSignUpPage from "./pages/Seller/SellerSignUpPage.jsx";
import SellerLoginPage from "./pages/Seller/SellerLoginPage.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import CreateProduct from "./pages/Seller/CreateProduct.jsx";
import AllProducts from "./pages/Seller/AllProducts.jsx";
import Orders from "./pages/Seller/Orders.jsx";
import Analytics from "./pages/Seller/Analytics.jsx";
import ProfileSettings from "./pages/Seller/ProfileSettings.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { ToastContainer, Bounce } from "react-toastify";
import { useSelector } from "react-redux";
import { loadUser, loadSeller } from "./redux/actions/user.js";
import store from "./redux/store.js";
import LoadingScreen from "./Components/Loading.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { useState, useEffect } from "react";
import AccountDashboard from "./pages/User/AccountPage.jsx"; // Import your account dashboard
import { Navigate } from "react-router-dom";
import SellerActivationPage from "./pages/Seller/SellerActivationPage.jsx"
import UpdateProduct from "./pages/Seller/UpdateProduct.jsx";
import CheckoutConfirmationPage from "./pages/CheckoutConfirmationPage.jsx";

function App() {
  const { isAuthenticated, role, loading, seller } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated || state.seller.isAuthenticated,
    role: state.user.role || state.seller.role,
    loading: state.user.loading || state.seller.loading,
    seller: state.seller,
  }));
  // console.log(seller);
  // console.log(role);
  // console.log(loading);

  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSeller());

    const timeout = setTimeout(() => {
      setDelayedLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          
          {/* Seller routes */}
          <Route
            path="/seller/signup"
            element={<SellerSignUpPage />}
          />
          <Route
            path="/seller/login"
            element={<SellerLoginPage />}
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/analytics"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/create-product"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/update-product/:id"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/all-products"
            element={
              <ProtectedRoute role="seller" redirectTo="/seller/login" roleMismatchMessage="You are not a seller.">
                <AllProducts />
              </ProtectedRoute>
            }
          />
          
          {/* User routes */}
          <Route
            path="/dashboard/*" // Account page with sub-routes for each section
            element={
              <ProtectedRoute role="user" redirectTo="/login" roleMismatchMessage="You are not logged in.">
                <AccountDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/" // Account page with sub-routes for each section
            element={
              <ProtectedRoute role="user" redirectTo="/login" roleMismatchMessage="You are not logged in.">
                <Navigate to={"/dashboard/personal-info"}/>
              </ProtectedRoute>
            }
          />
          
          {/* Other Routes */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
          <Route path="/product/checkout-confirmation" element={<CheckoutConfirmationPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
