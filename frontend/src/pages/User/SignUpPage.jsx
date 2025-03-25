import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';


function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(""); // Reset password error message
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
    if (image) {
      newForm.append("file", image);
    }
    await axios
      .post(`${server}/user/create-user/`, newForm, config)
      .then((res) => {
        // console.log(res.data.message);

        if (res.data.message != "User already exists") {
          toast.success(res.data.message);
          navigate("/login");
        } else {
          setErrorMessage(res.data.message);
          toast.error(res.data.message);
        }

        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err);
      });
  };

  return (
    <div className="mt-5 flex h-screen justify-center items-center">
      <div className="w-1/4  rounded-lg shadow-lg transition-all ease-out hover:shadow-2xl flex flex-col items-center p-5 justify-between">
        <h1 className="mt-2 text-2xl font-bold text-center">SignUp</h1>
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
                <AiFillEye size={20} className="text-slate-600"/>
              )}
            </span>
          </div>

          <input
            type="password"
            required
            placeholder="Confirm Password"
            className={`p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none ${
              password !== confirmPassword ? "border border-red-500" : ""
            }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {password !== confirmPassword ? (
            <p className="mt-2 text-left text-xs text-red-500">
              Password didn't match
            </p>
          ) : (
            passwordError && (
              <p className="mt-2 text-left text-xs text-red-500">
                {passwordError}
              </p>
            )
          )}

          {errorMessage ? (
            <p className="mt-2 text-left text-xs text-red-500">
              {errorMessage}
            </p>
          ) : (
            ""
          )}

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to={"/login"}>
              <span className="text-blue-500 cursor-pointer">LogIn</span>
            </Link>
          </p>
        </div>
        <div className="w-full mb-8 h-12">
          {/* <div className="flex items-center">
            {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-3 w-16 h-16 rounded-md mr-2" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-3 text-xs" />
          </div> */}

          {/* Social Logins */}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <button
            type="submit"
            className="hover:bg-blue-400 mt-2 w-full transition-all ease-out bg-primary text-white p-2 rounded-md"
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
