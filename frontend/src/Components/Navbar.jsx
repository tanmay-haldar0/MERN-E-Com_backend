import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import axios from "axios";
import {
  MdOutlineKeyboardArrowDown,
  MdShoppingCart,
  MdAddBusiness,
  MdReceiptLong,
  MdCardGiftcard,
  MdHome,
  MdLogin,
  MdPersonAdd,
  MdDashboard,
  MdAddShoppingCart,
  MdMenu, // Hamburger icon
  MdLogout,
  MdClose,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";
import { server } from "../server";
import { loadSeller, loadUser } from "../redux/actions/user";
import { toast } from "react-toastify";
import {
  FaAngleDown,
  FaBox,
  FaHeart,
  FaHistory,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import SearchBar from "./SearchBar";
// import debounce from "lodash.debounce";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null); // Add a ref for the drawer
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  // console.log(cart?.products?.length);

  function getFirstName(fullName) {
    if (!fullName || typeof fullName !== "string") return "";

    const parts = fullName.trim().split(" ");
    return parts[0]; // First word
  }

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    try {
      const tempRole = role;

      const res = await fetch(`${server}/${role}/logout`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Logged Out Successfully");
        navigate("/login");
        if (tempRole == "user" || "admin") {
          dispatch(loadUser());
        }
        if (tempRole == "seller") {
          dispatch(loadSeller());
        }
      } else {
        toast.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { isAuthenticated, user, seller } = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated || state.seller.isAuthenticated,
    user: state.user.user,
    seller: state.seller.user,
    ordersCount: state.seller.ordersCount || 0,
  }));

  const name = user ? user.name : seller ? seller.name : "";
  const role = user ? user.role : seller ? seller.role : "";
  const profilePic = user?.avatar?.url || seller?.avatar?.url || "";
  const ordersCount = 5;

  // console.log(role);

  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "";
    const names = fullName.split(" ");
    return `${names[0].charAt(0)}${
      names.length > 1 ? names[names.length - 1].charAt(0) : ""
    }`.toUpperCase();
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-around sm:block">
      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 py-2 z-50 flex items-center justify-between px-5 shadow-lg bg-white">
        {/* Hamburger Icon for Mobile */}
        <button
          onClick={toggleDrawer}
          className="sm:hidden flex items-center left-0 justify-center rounded-md"
        >
          <MdMenu className="text-2xl text-gray-700 hover:text-primary" />
        </button>

        <div className="flex items-center ml-3 justify-center h-full">
          <Link to={"/"}>
            <img src={logo} alt="Logo" className="sm:h-8 h-7 w-[280px] cursor-pointer" />
          </Link>
        </div>

        {/* Mobile: Search button in the Parent Component */}
        <div className="md:hidden absolute right-4 top-3">
          <button
            onClick={() => setShowMobileSearch(true)}
            className="flex items-center gap-2 px-2 py-2 bg-primary text-white rounded-full shadow"
          >
            <FaSearch />
          </button>
        </div>

        {/* Passing showMobileSearch and setShowMobileSearch as props */}
        <SearchBar
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
        />

        <div className="w-auto h-10 flex sm:flex md:flex items-center justify-center">
          {isAuthenticated && role === "seller" ? (
            <div className="hidden sm:flex gap-4">
              <Link
                to="/seller/create-product"
                className="flex flex-col items-center text-gray-700 hover:text-primary"
              >
                <MdAddBusiness className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
                <span className="text-[11px] text-slate-500">Create</span>
              </Link>
              <Link
                to="/seller/orders"
                className="flex flex-col items-center text-gray-700 hover:text-primary relative"
              >
                <MdReceiptLong className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
                {ordersCount > 0 && (
                  <div className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {ordersCount}
                  </div>
                )}
                <span className="text-[11px] text-slate-500">Orders</span>
              </Link>
              <Link
                to="/seller/coupons"
                className="flex flex-col items-center text-gray-700 hover:text-primary"
              >
                <MdCardGiftcard className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
                <span className="text-[11px] text-slate-500">Coupons</span>
              </Link>
            </div>
          ) : (
            <Link
              to={isAuthenticated ? "/cart" : "/signup"}
              className="hidden sm:block md:block"
            >
              <button className="m-2 group relative rounded-md w-auto h-10 sm:p-2 flex items-center justify-between hover:text-primary">
                <div className="text-lg m-1 font-medium flex items-center justify-between hover:text-primary">
                  <IoCartOutline className="text-[25px] mr-1 text-gray-700 group-hover:text-primary hover:scale-110 transition-transform" />
                  <span className="text-sm hidden sm:hidden md:block text-gray-700 font-medium group-hover:text-primary">
                    Cart
                  </span>
                </div>
                {cart?.products?.length > 0 ? (
                  <div className="bg-red-500 p-[2px] w-5 h-5 mx-1 text-[10px] hidden sm:flex items-center justify-center rounded-full font-semibold text-white">
                    {cart?.products?.length}
                  </div>
                ) : (
                  ""
                )}
              </button>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() =>
                  navigate(
                    role === "seller" ? "/seller/dashboard" : "/dashboard"
                  )
                }
                className="flex justify-center items-center"
              >
                <div className="m-2 hidden sm:flex rounded-full w-10 h-10 items-center justify-center bg-blue-100">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {getInitials(name)}
                    </span>
                  )}
                </div>
                <div className="text-sm hidden sm:flex justify-center items-center">
                  <div className="flex items-center gap-1 hover:text-primary">
                    <div className="">
                      <span>{getFirstName(user?.name || seller?.name)} </span>
                      <span className="text-xs text-gray-400">
                        {seller ? "Seller" : ""}
                      </span>
                    </div>
                    <FaAngleDown />
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="hidden sm:block p-2 text-slate-400 rounded-md text-center text-sm sm:text-md mr-1">
              <Link to={"/signup"}>
                <span className="hover:text-primary cursor-pointer">
                  SignUp{" "}
                </span>
              </Link>
              /
              <Link to={"/login"}>
                <span className="hover:text-primary cursor-pointer">
                  {" "}
                  Login{" "}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Side Drawer */}
      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 sm:hidden left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-1 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleDrawer}>
            <MdClose className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          {/* Profile Section */}
          {isAuthenticated && (
            <>
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-md font-medium">
                      {getInitials(name)}
                    </span>
                  )}
                </div>
                <div className="text-md">
                  <span className="font-medium">{getFirstName(name)}</span>
                  {/* <div className="font-light text-[9px]">{user?.email || seller.email}</div> */}
                  {role === "seller" && (
                    <span className="block text-xs text-gray-400">Seller</span>
                  )}
                </div>
              </div>
              <hr className="border-t border-gray-200 my-4" />
            </>
          )}

          {/* Links */}
          <Link
            to="/"
            onClick={toggleDrawer}
            className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/") && "text-primary font-semibold"
 }`}
          >
            <MdHome className="text-xl" /> Home
          </Link>

          {isAuthenticated && role === "seller" && (
            <>
              <Link
                to="/seller/dashboard"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/seller/dashboard") && "text-primary font-semibold"
 }`}
              >
                <MdDashboard className="text-xl" /> Dashboard
              </Link>
              <Link
                to="/seller/create-product"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/seller/create-product") && "text-primary font-semibold"
 }`}
              >
                <MdAddBusiness className="text-xl" /> Create Product
              </Link>
              <Link
                to="/seller/all-products"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/seller/all-products") && "text-primary font-semibold"
 }`}
              >
                <MdAddShoppingCart className="text-xl" /> All Products
              </Link>
              <Link
                to="/seller/orders"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary relative ${
   isActive("/seller/orders") && "text-primary font-semibold"
 }`}
              >
                <MdReceiptLong className="text-xl" /> Orders
                {ordersCount > 0 && (
                  <span
                    className="absolute
 right-4 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {ordersCount}
                  </span>
                )}
              </Link>
              <Link
                to="/seller/coupons"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/seller/coupons") && "text-primary font-semibold"
 }`}
              >
                <MdCardGiftcard className="text-xl" /> Coupons
              </Link>
            </>
          )}

          {isAuthenticated && (role === "user" || role === "admin") && (
            <>
              <Link
                to="/cart"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/cart") && "text-primary font-semibold"
 }`}
              >
                <MdShoppingCart className="text-xl" /> Cart
              </Link>

              <Link
                to="/shop"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/shop") && "text-primary font-semibold"
 }`}
              >
                <CiShop className="text-xl" /> Shop
              </Link>
              <Link
                to="/dashboard/personal-info"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/dashboard/personal-info") && "text-primary font-semibold"
 }`}
              >
                <MdOutlineSpaceDashboard className="text-xl" /> Dashboard
              </Link>
              <Link
                to="/dashboard/track-order"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/dashboard/track-order") && "text-primary font-semibold"
 }`}
              >
                <FaBox className="text-xl" /> Track Order
              </Link>
              <Link
                to="/dashboard/addresses"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/dashboard/addresses") && "text-primary font-semibold"
 }`}
              >
                <FaMapMarkerAlt className="text-xl" /> Address
              </Link>
              <Link
                to="/dashboard/saved-designs"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/dashboard/saved-designs") && "text-primary font-semibold"
 }`}
              >
                <FaHeart className="text-xl" /> Saved Designs
              </Link>
              <Link
                to="/dashboard/order-history"
                onClick={toggleDrawer}
                className={`flex items-center gap-2 px-4 py-1 text-base rounded-md
 text-gray-700 hover:text-primary ${
   isActive("/dashboard/order-history") && "text-primary font-semibold"
 }`}
              >
                <FaHistory className="text-xl" /> Order History
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/login") && "text-primary font-semibold"
 }`}
              >
                <MdLogin className="text-xl" /> Login
              </Link>
              <Link
                to="/signup"
                onClick={toggleDrawer}
                className={`flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-gray-700 hover:text-primary ${
   isActive("/signup") && "text-primary font-semibold"
 }`}
              >
                <MdPersonAdd className="text-xl" /> Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-1 text-base rounded-md
 gap-2 text-red-600 hover:text-red-700 mt-2"
            >
              <MdLogout className="text-xl" /> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
