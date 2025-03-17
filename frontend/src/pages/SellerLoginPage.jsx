import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadSeller, loadUser } from '../redux/actions/user';
import { ClipLoader } from 'react-spinners'; // Import a loading spinner
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';

const SellerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    // Handle form submission
    e.preventDefault();
    setIsLoading(true);  // Set loading to true on submit
    await axios.post(`${server}/seller/login`, {
      email: email,
      password: password
    }, { withCredentials: true }).then((res) => {
      toast.success("Login Successful.");
      console.log(res);
      dispatch(loadSeller()); // Dispatch loadUser action
      setIsLoading(false); // Reset loading state on success
      navigate("/seller/dashboard");
    }).catch((err) => {
      setIsLoading(false); // Reset loading state on error
      console.error("Login error:", err); // Log the error for debugging
      toast.error(err.response?.data?.message);
    });
  };

  return (
    <div className='mt-5 flex h-screen justify-center items-center'>
      <div className='w-1/4 h-3/6 rounded-lg shadow-lg transition-all ease-out hover:shadow-2xl flex flex-col items-center p-5 justify-between'>
        <h1 className='mt-2 text-2xl font-bold text-center'>Seller Login</h1>
        <div className='text-center input-box w-full p-3'>
          <input
            type='email'
            required
            placeholder='Your Email'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='relative mt-3'>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              required
              placeholder='Password'
              className='p-2 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none pr-10'
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className='absolute right-3 top-3 cursor-pointer text-slate-500'
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>
          <div className='mt-2 w-full flex items-center justify-between'>
            <Link to={'/forgot-password'}>
              <span className='text-sm text-blue-500 cursor-pointer'>Forgot Password?</span>
            </Link>
          </div>
          <p className='mt-4 text-center text-sm text-slate-500'>
            New to ClassiCustom?{' '}
            <Link to={'/signup'}>
              <span className='text-blue-500 cursor-pointer'>Sign Up</span>
            </Link>
          </p>
        </div>
        <button
          onClick={handleSubmit}
          type='button'
          className='hover:bg-blue-400 mt-2 w-full transition-all ease-out bg-primary text-white p-2 rounded-md'
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default SellerLoginPage;
