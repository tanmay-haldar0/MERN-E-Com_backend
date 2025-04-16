import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${server}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login Successful.");
      dispatch(loadUser());
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic or redirect
    toast.info("Google login not implemented yet.");
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic or redirect
    toast.info("Facebook login not implemented yet.");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md rounded-lg shadow-md p-5">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* Email/Password Form */}
        <div className="text-center w-full p-3">
          <input
            type="email"
            required
            placeholder="Your Email"
            className="p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative mt-3">
            <input
              type={isPasswordVisible ? "text" : "password"}
              required
              placeholder="Password"
              className="p-2 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-slate-500"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </span>
          </div>

          <div className="mt-2 w-full flex items-center justify-between">
            <Link to={"/forgot-password"}>
              <span className="text-sm text-blue-500 cursor-pointer">
                Forgot Password?
              </span>
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            New to ClassiCustom?{" "}
            <Link to={"/signup"}>
              <span className="text-blue-500 cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          type="button"
          className="hover:bg-blue-400 w-full transition-all ease-out bg-primary text-white p-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
        </button>

        {/* Social Logins */}
        <div className="w-full mb-2 mt-5">
          <div className="flex items-center justify-center mb-2">
            <div className="h-px w-1/3 bg-gray-300"></div>
            <span className="px-3 text-xs text-center text-gray-500">or login with</span>
            <div className="h-px w-1/3 bg-gray-300"></div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleLogin}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={handleFacebookLogin}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FaFacebook size={24} color="#1877f2" />
            </button>
            <button
              onClick={() => toast.info("Apple login not implemented yet.")}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FaApple size={24} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
