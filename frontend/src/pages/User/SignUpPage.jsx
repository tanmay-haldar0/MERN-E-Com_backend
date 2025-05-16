import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { signInWithGooglePopup, auth } from "../../firebase";
import { loadUser } from "../../redux/actions/user.js";
import { useDispatch } from "react-redux";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      setLoadingGoogle(true); // optional
      const result = await signInWithGooglePopup();
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await axios.post(`${server}/user/google-auth`, {
        idToken,
      }, { withCredentials: true });
      dispatch(loadUser());
      // Save token or user if needed
      localStorage.setItem("token", response.data.token);

      toast.success(response.data.message);
      navigate("/");

    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google sign-in failed.");
    } finally {
      setLoadingGoogle(false); // optional
    }
  };



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
    if (image) newForm.append("file", image);

    try {
      const res = await axios.post(`${server}/user/create-user/`, newForm, config);
      if (res.data.message !== "User already exists") {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        setErrorMessage(res.data.message);
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.log(err);
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg shadow-md transition-all ease-out hover:shadow-2xl p-5">
        <h1 className="text-2xl font-bold text-center">SignUp</h1>

        <div className="text-center input-box w-full p-3">
          <input
            type="text"
            required
            name="name"
            placeholder="Your Name."
            className="p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            required
            placeholder="Your Email."
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
                <AiFillEyeInvisible size={20} className="text-primary" />
              ) : (
                <AiFillEye size={20} className="text-slate-600" />
              )}
            </span>
          </div>

          <input
            type="password"
            required
            placeholder="Confirm Password"
            className={`p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none ${password !== confirmPassword ? "border border-red-500" : ""
              }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {password !== confirmPassword ? (
            <p className="mt-2 text-left text-xs text-red-500">Password didn't match</p>
          ) : (
            passwordError && (
              <p className="mt-2 text-left text-xs text-red-500">{passwordError}</p>
            )
          )}

          {errorMessage && (
            <p className="mt-2 text-left text-xs text-red-500">{errorMessage}</p>
          )}

          <p className="mt-4 text-left text-[13.5px] text-slate-500">
            Already have an account?{" "}
            <Link to={"/login"}>
              <span className="text-blue-500 cursor-pointer">LogIn</span>
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <button
            type="submit"
            className="hover:bg-blue-400 mt-2 w-full transition-all ease-out bg-primary text-white p-2 rounded-md"
          >
            SignUp
          </button>
        </form>

        {/* Social Logins */}
        <div className="w-full mt-2">
          <div className="flex items-center justify-center mb-2">
            <div className="h-px w-1/3 bg-gray-300"></div>
            <span className="text-xs text-center text-gray-500">or</span>
            <div className="h-px w-1/3 bg-gray-300"></div>
          </div>

          {/* <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={() => toast.info("Facebook sign-up not implemented yet.")}
              type="button"
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FaFacebook size={24} color="#1877f2" />
            </button>
            <button
              onClick={() => toast.info("Apple sign-up not implemented yet.")}
              type="button"
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <FaApple size={24} className="text-black" />
            </button>
          </div> */}
          <div className="mt-3">
            <button
              onClick={handleGoogleAuth}
              type="button"
              disabled={loadingGoogle}
              className={`flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition
              ${loadingGoogle ? "cursor-not-allowed opacity-70" : ""}
            `}
            >
              {loadingGoogle ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <FcGoogle size={20} />
              )}
              <span className="text-sm text-slate-700">
                {loadingGoogle ? "Signing in..." : "Continue with Google"}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
