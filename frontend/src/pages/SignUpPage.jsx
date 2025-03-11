import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from "../server.js"

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   alert("Passwords do not match!");
    //   return;
    // };
    setPasswordError(''); // Reset password error message
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character.');
      return;
    }
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const newForm = new FormData();
    newForm.append('name', name);
    newForm.append('email', email);
    newForm.append('password', password);
    if (image) {
      newForm.append('file', image);
    }
    await axios.post(`${server}/user/create-user/`, newForm, config).then((res) => {
      console.log(res);     
    }).catch((err) => {
      console.log(err);
    })
  };

  return (
    <div className="mt-5 flex h-screen justify-center items-center">
      <div className="w-1/4  rounded-lg shadow-lg transition-all ease-out hover:shadow-2xl flex flex-col items-center p-5 justify-between">
        <h1 className="mt-2 text-2xl font-bold text-center">SignUp</h1>
        <div className="text-center input-box w-full p-3">
          <input
            type="text"
            required
            name='name'
            placeholder='Your Name.'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            required
            placeholder='Your Email.'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder='Password'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder='Confirm Password'
            className={`p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none ${password !== confirmPassword ? 'border border-red-500' : ''}`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {password !== confirmPassword ? (
            <p className='mt-2 text-left text-xs text-red-500'>Password didn't match</p>
          ) : (
            passwordError && <p className='mt-2 text-left text-xs text-red-500'>{passwordError}</p>
          )}


          <p className='mt-4 text-center text-sm text-slate-500'>Already have an account? <Link to={"/login"}><span className='text-blue-500 cursor-pointer'>LogIn</span></Link></p>
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
            className='hover:bg-blue-400 mt-2 w-full transition-all ease-out bg-primary text-white p-2 rounded-md'
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
