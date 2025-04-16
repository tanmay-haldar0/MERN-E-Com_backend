import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadSeller } from '../../redux/actions/user';
import { ClipLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';

const SellerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `${server}/seller/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success('Login Successful.');
      dispatch(loadSeller());
      navigate('/seller/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Seller Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Your Email"
            className="w-full px-4 py-2 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              required
              placeholder="Password"
              className="w-full px-4 py-2 pr-10 bg-slate-100 rounded-md text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-2.5 text-slate-500 cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-400 transition"
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            New to ClassiCustom?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerLoginPage;
