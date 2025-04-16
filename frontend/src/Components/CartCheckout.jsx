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
    <div className="p-3 rounded-lg bg-white shadow-sm w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Checkout
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="py-2 px-2 text-left">Item</th>
              <th className="py-2 px-2 text-left">Price</th>
              <th className="py-2 px-2 text-left">Qty</th>
              <th className="py-2 px-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {cartItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-2">{item.name}</td>
                <td className="py-2 px-2">₹{item.price.toFixed(2)}</td>
                <td className="py-2 px-2">{item.quantity}</td>
                <td className="py-2 px-2">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-medium">
              <td colSpan="3" className="py-2 px-2 text-right">Subtotal:</td>
              <td className="py-2 px-2">₹{totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="py-2 px-2 text-right">Delivery:</td>
              <td className="py-2 px-2">₹{deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr className="font-bold text-red-600">
              <td colSpan="3" className="py-2 px-2 text-right">Total:</td>
              <td className="py-2 px-2">₹{finalTotalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Summary */}
      <div className="md:hidden">
        {cartItems.map((item, index) => (
          <div key={index} className="border-b py-2">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-700">₹{item.price.toFixed(2)} × {item.quantity}</p>
            <p className="text-sm font-semibold">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="text-sm font-medium mt-2">
          <p className="text-right">Subtotal: ₹{totalPrice.toFixed(2)}</p>
          <p className="text-right">Delivery: ₹{deliveryCharge.toFixed(2)}</p>
          <p className="text-right text-red-600 text-lg font-bold mt-1">
            Total: ₹{finalTotalPrice}
          </p>
        </div>
      </div>

      {/* Checkout Button */}
      <button className="w-full mt-4 bg-blue-600 text-white py-2 text-sm rounded hover:bg-blue-700 transition-all">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
