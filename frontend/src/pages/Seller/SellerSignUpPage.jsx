import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function SellerSignUpPage() {
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
      return;
    }

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const newForm = new FormData();
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    newForm.append("shopName", shopName);
    newForm.append("phoneNumber", phoneNumber);
    if (image) newForm.append("file", image);

    try {
      const res = await axios.post(`${server}/seller/create-user/`, newForm, config);

      if (res.data.message !== "User already exists") {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        setErrorMessage(res.data.message);
        toast.error(res.data.message);
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Seller Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="shopName"
            required
            placeholder="Your Shop Name"
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="number"
            required
            placeholder="Your Phone Number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <span
              className="absolute right-3 top-2.5 text-slate-500 cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            required
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              password !== confirmPassword ? "border border-red-500" : ""
            }`}
          />

          {/* Error Messages */}
          {password !== confirmPassword && (
            <p className="text-xs text-red-500">Passwords don't match</p>
          )}
          {passwordError && (
            <p className="text-xs text-red-500">{passwordError}</p>
          )}
          {errorMessage && (
            <p className="text-xs text-red-500">{errorMessage}</p>
          )}

          {/* File Upload (optional, style later if needed) */}
          {/* <input type="file" onChange={(e) => setImage(e.target.files[0])} /> */}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-400 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/seller/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SellerSignUpPage;