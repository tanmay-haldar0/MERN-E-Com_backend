import React from 'react';

const Checkout = () => {
  const cartItems = [
    { name: 'Medium Sized Pizza', price: 69.49, quantity: 2 },
    { name: 'Large Burger', price: 29.49, quantity: 1 },
    { name: 'Veg Dumplings', price: 49.99, quantity: 1 }
  ];

  const deliveryCharge = 50.00;
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotalPrice = (totalPrice + deliveryCharge).toFixed(2);

  return (
    <div className='max-w-[800px] mx-auto p-4 rounded-lg'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-4 text-center'>
        Checkout
      </h1>

      {/* Calculation Breakdown */}
      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        {/* Desktop Table View */}
        <table className='min-w-full hidden md:table'>
          <thead>
            <tr className='bg-blue-200 text-gray-700'>
              <th className='py-3 px-4 text-left'>Item</th>
              <th className='py-3 px-4 text-left'>Price (₹)</th>
              <th className='py-3 px-4 text-left'>Quantity</th>
              <th className='py-3 px-4 text-left'>Total (₹)</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {cartItems.map((item, index) => (
              <tr key={index} className='border-b border-gray-300 hover:bg-gray-200'>
                <td className='py-3 px-4'>{item.name}</td>
                <td className='py-3 px-4'>₹{item.price.toFixed(2)}</td>
                <td className='py-3 px-4'>{item.quantity}</td>
                <td className='py-3 px-4'>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr className='font-semibold'>
              <td colSpan="3" className='py-3 px-4 text-right'>Subtotal:</td>
              <td className='py-3 px-4'>₹{totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className='py-3 px-4 text-right'>Delivery Charge:</td>
              <td className='py-3 px-4'>₹{deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr className='font-bold text-2xl text-red-500'>
              <td colSpan="3" className='py-3 px-4 text-right'>Total:</td>
              <td className='py-3 px-4'>₹{finalTotalPrice}</td>
            </tr>
          </tbody>
        </table>

        {/* Mobile View */}
        <div className='md:hidden w-[90vw]'>
          {cartItems.map((item, index) => (
            <div key={index} className='border-b border-gray-300 p-4'>
              <h3 className='font-semibold'>{item.name}</h3>
              <p className='text-gray-700'>Price: ₹{item.price.toFixed(2)}</p>
              <p className='text-gray-700'>Quantity: {item.quantity}</p>
              <p className='font-bold'>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className='font-semibold p-4 border-t border-gray-300'>
            <p className='text-right'>Subtotal: ₹{totalPrice.toFixed(2)}</p>
          </div>
          <div className='p-4 border-t border-gray-300'>
            <p className='text-right'>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
          </div>
          <div className='font-bold text-2xl text-red-500 p-4 border-t border-gray-300'>
            <p className='text-right'>Total: ₹{finalTotalPrice}</p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className='flex justify-center mt-5'>
        <button className='bg-blue-600 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200 transform hover:scale-105 w-full'>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;