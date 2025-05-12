import React, { Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Vendors from "./pages/Vendors";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Themes from "./pages/Themes";
import Statistics from "./pages/Statistics";
import AdminLogin from "./pages/AdminLogin";
import { loadAdminUser } from "./redux/actions/admin";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Navigate } from "react-router-dom";

function SkeletonLoader() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
}

function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(loadAdminUser());
  }, [dispatch]);

  if (loading && !hideLayout) {
    return <SkeletonLoader />; // Show loader when loading, except on the login page
  }

  if (!isAuthenticated && !hideLayout) {
    return <Navigate to="/login" replace />;
  }

  if (hideLayout) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/themes"
              element={
                <ProtectedRoute>
                  <Themes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
