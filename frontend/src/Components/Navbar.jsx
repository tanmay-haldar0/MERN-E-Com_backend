import React from "react";
import { useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown, MdAddBusiness, MdReceiptLong, MdCardGiftcard } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, seller} = useSelector((state) => ({
    isAuthenticated: state.user.isAuthenticated || state.seller.isAuthenticated,
    user: state.user.user,
    seller: state.seller.user,
    ordersCount: state.seller.ordersCount || 0,
  }));

  const name = user ? user.name : seller ? seller.name : "";
  const role = user ? user.role : seller ? seller.role : "";
  const profilePic = user?.avatar?.url || seller?.avatar?.url || "";
  const ordersCount = 5;


  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "";
    const names = fullName.split(" ");
    return `${names[0].charAt(0)}${names.length > 1 ? names[names.length - 1].charAt(0) : ""}`.toUpperCase();
  };

  return (
    <div className="w-full fixed top-0 left-0 py-2 z-50 flex items-center justify-between px-5 shadow-lg bg-white">
      <div className="flex items-center justify-center h-full">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="sm:h-8 h-6 cursor-pointer" />
        </Link>
      </div>

      <div className="sm:w-2/5 h-10 rounded-md items-center relative bg-slate-100 hidden sm:flex md:flex">
        <input
          type="text"
          placeholder="Search Here"
          className="p-4 w-full h-8 bg-transparent rounded-md text-slate-600 outline-none"
        />
        <MdSearch className="absolute text-gray-600 right-3 text-xl hover:text-primary" />
      </div>

      <div className="w-auto h-10 flex sm:flex md:flex items-center justify-center">
        {isAuthenticated && role === "seller" ? (
          <div className="flex gap-4">
            <Link to="/seller/add-product" className="flex flex-col items-center text-gray-700 hover:text-primary">
              <MdAddBusiness className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
              <span className="text-[11px] text-slate-500">Create</span>
            </Link>
            <Link to="/seller/orders" className="flex flex-col items-center text-gray-700 hover:text-primary relative">
              <MdReceiptLong className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
              {ordersCount > 0 && (
                <div className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {ordersCount}
                </div>
              )}
              <span className="text-[11px] text-slate-500">Orders</span>
            </Link>
            <Link to="/seller/coupons" className="flex flex-col items-center text-gray-700 hover:text-primary">
              <MdCardGiftcard className="text-2xl text-slate-500 hover:scale-110 transition-transform" />
              <span className="text-[11px] text-slate-500">Coupons</span>
            </Link>
          </div>
        ) : (
          <Link to={isAuthenticated ? "/cart" : "/signup"} className="hidden sm:block md:block">
            <button className="m-2 group relative rounded-md w-auto h-10 sm:p-2 flex items-center justify-between hover:text-primary">
              <div className="text-lg m-1 font-medium flex items-center justify-between hover:text-primary">
                <IoCartOutline className="text-[25px] mr-1 text-gray-700 group-hover:text-primary hover:scale-110 transition-transform" />
                <span className="text-sm hidden sm:hidden md:block text-gray-700 font-medium group-hover:text-primary">
                  Cart
                </span>
              </div>
              <div className="bg-red-500 p-[2px] w-5 h-5 mx-1 text-[10px] hidden sm:flex items-center justify-center rounded-full font-semibold text-white">
                2
              </div>
            </button>
          </Link>
        )}

        {isAuthenticated ? (
          <Link to={role === "seller" ? "/seller/dashboard" : "/dashboard"} className="hidden sm:block">
            <div className="flex items-center justify-between sm:p-2 cursor-pointer">
              <div className="m-2 rounded-full w-10 h-10 flex items-center justify-center bg-blue-100">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-sm font-medium">{getInitials(name)}</span>
                )}
              </div>
              <div className="hidden sm:hidden md:flex lg:flex items-center justify-center group cursor-pointer">
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-primary">
                  {name.split(" ")[0]}
                  {role === "seller" && <span className="text-xs text-gray-500"> Seller</span>}
                </h3>
                <MdOutlineKeyboardArrowDown className="text-sm text-gray-700 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center text-gray-700">
            <Link to={"/signup"}>
              <span className="hover:text-blue-500 cursor-pointer">SignUp </span>
            </Link>
            / 
            <Link to={"/login"}>
              <span className="hover:text-blue-500 cursor-pointer"> Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
