import React from 'react'
import logo from "../assets/logo.png"
import { MdFacebook } from "react-icons/md";
import { FaTwitter, FaInstagram, FaSnapchat } from "react-icons/fa";

const Footer = () => {
  const rupay ="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/800px-Rupay-Logo.png?20200811062726"
  const visa = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png?20170118154621"
  const mCard = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/MasterCard_early_1990s_logo.png/800px-MasterCard_early_1990s_logo.png?20170118155024"
  const upi = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/463px-UPI-Logo-vector.svg.png?20200901100648"
  const paypal = "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png?20150315064712"

  return (
    <>
      <footer className="bg-gray-800 text-white pt-8 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            {/* Company Info */}
            <div className='w-full mt-3 sm:w-1/4'>
              <div className="bg-white rounded-lg w-3/4 mb-3"><img src={logo} alt="" className='h-10' /></div>
              <p className="text-xs">
                We are dedicated to providing the best products and services to our customers. Our mission is to enhance your shopping experience with quality and value.
              </p>
              {/* Social Media Links */}
              <div className="flex items-center mt-4" >
                <a href="https://facebook.com" className="hover:text-gray-400 cursor-pointer" target="_blank" rel="noopener noreferrer">

                  <MdFacebook className='text-2xl mr-2' />

                </a>
                <a href="https://twitter.com" className="hover:text-gray-400 cursor-pointer" target="_blank" rel="noopener noreferrer">

                  <FaTwitter className='text-2xl mx-2' />

                </a>
                <a href="https://instagram.com" className="hover:text-gray-400 cursor-pointer" target="_blank" rel="noopener noreferrer">

                  <FaInstagram className='text-2xl mx-2' />

                </a>
                <a href="https://snapchat.com" className="hover:text-gray-400 cursor-pointer" target="_blank" rel="noopener noreferrer">

                  <FaSnapchat className='text-2xl mx-2' />

                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className='flex flex-col sm:items-center justify-center w-full mt-3 sm:w-1/4'>
              <div className="">
                <h3 className="text-lg font-medium mb-2">Quick Links</h3>
                <ul className="space-y-1 text-sm font-normal ">
                  <li><a href="/about" className="hover:text-gray-400">About</a></li>
                  <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
                  <li><a href="/privacy" className="hover:text-gray-400">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-gray-400">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="w-full mt-3 sm:w-2/6">
              <div className="">
                <ul className="flex justify-center text-sm">
                  <li className='bg-white h-8 p-2 flex items-center justify-center mr-1 w-16'><img src={upi} className='w-12' alt="rupay" /></li>
                  <li className='bg-white h-8 p-2 flex items-center justify-center mx-1 w-16'><img src={rupay} className='w-12' alt="rupay" /></li>
                  <li className='bg-white h-8 p-2 flex items-center justify-center mx-1 w-16'><img src={visa} className='w-12' alt="rupay" /></li>
                  <li className='bg-white h-8 p-2 flex items-center justify-center mx-1 w-16'><img src={mCard} className='w-12' alt="rupay" /></li>
                  <li className='bg-white h-8 p-2 flex items-center justify-center mx-1 w-16'><img src={paypal} className='w-7' alt="rupay" /></li>

                </ul>
              </div>
            </div>

            {/* Payment Types Supported Section */}



          </div>





          {/* Copyright Section */}

        </div>
        <div className="bg-gray-900 p-3 flex items-center justify-center text-center mt-4 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
