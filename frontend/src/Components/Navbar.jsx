import React, { useEffect, useState } from 'react'
import { IoCartOutline } from 'react-icons/io5'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import logo from '../assets/logo.png' // Import the logo image
import { server } from '../server'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const [isLogedIn,setIsLogedIn] = useState(false);
  const [name,setName] = useState();
  const [profilePic,setProfilePic] = useState();

  useEffect(() => {
        // Add a check to see if the user is already logged in
        axios.get(`${server}/user/get-user`,{withCredentials:true}).then((res) =>{
          // console.log(res)
          if(res.data.success){
            setIsLogedIn(true);
            setName(res.data.user.name);
            if(res.data.user.avatar.url !=""){

              setProfilePic(res.data.user.avatar.url);
            } // Assuming avatar URL is in res.data.user.avatar
          }
        }).catch((err)=>{
          console.log(err)
        })
      }, [])

  const getInitials = (fullName) => {
    const names = fullName.split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (
    <div className='w-full fixed top-0 left-0 py-2 z-50 flex items-center justify-between px-5 shadow-lg bg-white'>
      <div className='flex items-center justify-center h-full'>
        <Link to={'/'}>
          <img src={logo} alt='Logo' className='sm:h-8 h-6 cursor-pointer' />
        </Link>
      </div>

      <div className='sm:w-2/5 h-10 rounded-md items-center relative bg-slate-100 hidden sm:flex md:flex'>
        <input
          type='text'
          placeholder='Search Here'
          className='p-4 w-full h-8 bg-transparent rounded-md text-slate-600 outline-none'
        />
        <MdSearch className='absolute text-slate-500 right-3 text-xl hover:text-primary' />
      </div>

      <div className='w-auto h-10 flex sm:flex md:flex items-center justify-center'>
        <Link to={isLogedIn ? ('/cart') : ('/signup')} className='hidden sm:block md:block'>
          <button className='m-2 group relative rounded-md w-auto h-10 sm:p-2 flex items-center justify-between hover:text-primary'>
            <div className='text-lg m-1 font-medium flex items-center justify-between hover:text-primary'>
              <IoCartOutline className='text-[25px] mr-1 text-slate-800 group-hover:text-primary' />
              <span className='text-sm hidden sm:hidden md:block text-slate-800 font-medium group-hover:text-primary'>
                Cart
              </span>
            </div>
            <div className='bg-red-500 p-[2px] w-5 h-5 mx-1 text-[10px] hidden sm:flex items-center justify-center rounded-full font-semibold text-white'>
              2
            </div>
          </button>
        </Link>
        <button className='p-1 sm:hidden rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 right-3 font-medium text-xl'>
          <MdSearch />
        </button>

        {isLogedIn ? (
          <Link to={'/signup'}>
            <div className='flex items-center justify-between sm:p-2 cursor-pointer'>
              <div className='m-2 rounded-full w-10 h-10 flex items-center justify-center bg-blue-100'>
                {profilePic ? (
                  <img src={profilePic} alt='Profile' className='w-full h-full rounded-full' />
                ) : (
                  <span className='text-sm font-medium'>{getInitials(name)}</span>
                )}
              </div>
              <div className='hidden sm:hidden md:flex lg:flex items-center justify-center group cursor-pointer'>
                <h3 className='text-sm font-medium text-slate-800 group-hover:text-primary'>
                  {name.split(' ')[0]} {/* Display first name */}
                </h3>
                <MdOutlineKeyboardArrowDown className='text-sm text-gray-600 group-hover:text-primary' />
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center text-slate-500">
            <Link to={'/signup'}><span className='hover:text-blue-500 cursor-pointer'>SignUp </span></Link>/ <Link to={'/login'}><span className='hover:text-blue-500 cursor-pointer'> Login</span></Link>
          </div>
        )}
       
      </div>
    </div>
  )
}

export default Navbar
