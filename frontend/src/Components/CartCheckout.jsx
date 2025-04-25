import React from 'react';

const Checkout = ({ cartItems = [], totalPrice, totalQuantity }) => {
  // console.log(cartItems); // Confirm items received

  const deliveryCharge = 50.0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item?.priceAtAddTime ?? 0) * (item?.quantity ?? 1),
    0
  );
  const finalTotalPrice = (subtotal + deliveryCharge).toFixed(2);

  return (
    <div className="p-3 rounded-lg bg-white shadow-sm w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Checkout</h2>

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
                <td className="py-2 px-2">{item?.productId?.name ?? "Unnamed"}</td>
                <td className="py-2 px-2">₹{(item?.priceAtAddTime ?? 0).toFixed(2)}</td>
                <td className="py-2 px-2">{item?.quantity ?? 1}</td>
                <td className="py-2 px-2">
                  ₹{((item?.priceAtAddTime ?? 0) * (item?.quantity ?? 1)).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-medium">
              <td colSpan="3" className="py-2 px-2 text-right">Subtotal:</td>
              <td className="py-2 px-2">₹{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="py-2 px-2 text-right">Delivery:</td>
              <td className="py-2 px-2">₹{deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr className="font-bold md:text-xl text-red-600">
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
            <p className="font-medium">{item?.productId?.name ?? "Unnamed"}</p>
            <p className="text-sm text-gray-700">
              ₹{(item?.priceAtAddTime ?? 0).toFixed(2)} × {item?.quantity ?? 1}
            </p>
            <p className="text-sm font-semibold">
              Total: ₹{((item?.priceAtAddTime ?? 0) * (item?.quantity ?? 1)).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="text-sm font-medium mt-2">
          <p className="text-right">Subtotal: ₹{subtotal.toFixed(2)}</p>
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
