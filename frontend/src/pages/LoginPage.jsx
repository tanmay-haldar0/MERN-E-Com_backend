import React from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className='mt-5 flex h-screen justify-center items-center'>
      <div className='w-1/4 h-3/6 rounded-lg shadow-lg transition-all ease-out hover:shadow-2xl flex flex-col items-center p-5 justify-between'>
        <h1 className='mt-2 text-2xl font-bold text-center'>Login</h1>
        <div className='text-center input-box w-full p-3'>

          <input
            type='email'
            required
            placeholder='Your Email.'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
          />
          <input
            type='password'
            required
            placeholder='Password'
            className='p-2 mt-3 shadow-sm hover:shadow-md w-full bg-slate-100 rounded-md text-slate-600 outline-none'
          />
          <div className="mt-2 w-full flex items-center justify-between">
          <div className="p-1 flex items-center justify-between ">
          <input className='mr-1' type="checkbox" name="" id="" />
          <span className='text-sm text-blue-500'>Remember Me</span></div>
          <Link to={'/signup'}>
            <span className='text-sm text-blue-500 cursor-pointer'>Forgot Password ?</span>
          </Link>
          </div>


          <p className='mt-4 text-center text-sm text-slate-500'>
            New to ClassiCustom ?{' '}
            <Link to={'/signup'}>
              <span className='text-blue-500 cursor-pointer'>SignUp</span>
            </Link>
          </p>
        </div>
        <div className='w-full h-12 '></div>
        <button
          type='submit'
          className='hover:bg-blue-400 mt-2 w-full transition-all ease-out bg-primary text-white p-2 rounded-md'
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default LoginPage
