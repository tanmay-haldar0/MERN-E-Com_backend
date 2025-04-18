import React, { useState } from 'react';
import SideNav from '../../Components/SideNav';

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const dummyOrders = [
  {
    _id: 'order001',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    shippingAddress: {
      street: '123 Park Lane',
      city: 'Kolkata',
      state: 'WB',
      zip: '700001',
      phone: '9876543210',
    },
    status: 'Processing',
    items: [
      { name: 'Product A', quantity: 2, price: 200 },
      { name: 'Product B', quantity: 1, price: 150 },
    ],
    totalAmount: 550,
  },
  {
    _id: 'order002',
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    shippingAddress: {
      street: '45 Lake View',
      city: 'Delhi',
      state: 'DL',
      zip: '110001',
      phone: '9988776655',
    },
    status: 'Shipped',
    items: [
      { name: 'Product C', quantity: 1, price: 300 },
    ],
    totalAmount: 300,
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(dummyOrders);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mt-14">
      <SideNav />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-4xl font-bold text-gray-900">📋 All Orders</h1>
        <p className="text-gray-600 mb-6">View and manage customer orders here.</p>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #{order._id}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Ordered by: {order.user.name} ({order.user.email})
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Address: {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} - {order.shippingAddress.zip}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="p-2 border rounded-md focus:ring-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-right font-bold text-gray-800">
                    Total: ₹{order.totalAmount}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
