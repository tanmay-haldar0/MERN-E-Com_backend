import React from 'react';
import logo from "../assets/logo.png";
import { MdFacebook } from "react-icons/md";
import { FaTwitter, FaInstagram, FaSnapchat } from "react-icons/fa";

const Footer = () => {
  // const paymentLogos = [
  //   {
  //     src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/463px-UPI-Logo-vector.svg.png?20200901100648",
  //     alt: "UPI",
  //   },
  //   {
  //     src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/800px-Rupay-Logo.png?20200811062726",
  //     alt: "RuPay",
  //   },
  //   {
  //     src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png?20170118154621",
  //     alt: "Visa",
  //   },
  //   {
  //     src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/MasterCard_early_1990s_logo.png/800px-MasterCard_early_1990s_logo.png?20170118155024",
  //     alt: "MasterCard",
  //   },
  //   {
  //     src: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png?20150315064712",
  //     alt: "PayPal",
  //   },
  // ];

  return (
    <footer className="bg-gray-800 text-white pt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
          {/* Company Info */}
          <div className="sm:w-1/4">
            <div className="bg-white rounded-lg w-fit mb-3 px-2 py-1">
              <img src={logo} alt="Company Logo" className="h-7 sm:h-10" />
            </div>
            <p className="text-xs">
              We are dedicated to providing the best products and services to our customers. Our mission is to enhance your shopping experience with quality and value.
            </p>
            {/* Social Media */}
            <div className="flex items-center mt-4 space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                <MdFacebook className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                <FaSnapchat className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:w-1/4">
            <h3 className="text-lg font-medium mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/about" className="hover:text-gray-400">About</a></li>
              <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
              <li><a href="/privacy" className="hover:text-gray-400">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-gray-400">Terms of Service</a></li>
            </ul>
          </div>

          {/* Payment Methods */}
          {/* <div className="sm:w-1/3">
            <h3 className="text-lg font-medium mb-2 text-center sm:text-left">Accepted Payments</h3>
            <ul className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              {paymentLogos.map((logo, index) => (
                <li
                  key={index}
                  className="bg-white p-2 h-8 w-12 flex items-center justify-center rounded"
                >
                  <img src={logo.src} alt={logo.alt} className="h-6 object-contain" />
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 text-center text-xs sm:text-sm py-3 mt-6">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
