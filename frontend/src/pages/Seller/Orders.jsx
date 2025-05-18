import React, { useEffect, useState } from 'react';
import SideNav from '../../Components/SideNav';
import { server } from '../../server';
import { toast } from 'react-toastify';
import axios from 'axios';

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${server}/order/seller-orders`, {
          withCredentials: true,
        });
        setOrders(response.data.orders);
        // console.log('Fetched Orders:', response.data.orders);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        toast.error("Failed to load seller orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    axios
      .put(
        `${server}/order/update-order/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      )
      .then(() => toast.success("Order status updated!"))
      .catch(() => toast.error("Failed to update status."));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mt-14">
      <SideNav />
      <div className="flex-1 sm:p-8 p-4 md:ml-64">
        <h1 className="text-4xl font-bold text-gray-900">📋 All Orders</h1>
        <p className="text-gray-600 mb-6">View and manage customer orders here.</p>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : (
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
                        Ordered by: {order.userId?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Address: {order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2},{' '},{order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state} - {order.shippingAddress?.postalCode},
                        {" "} {order.shippingAddress?.country}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {order.shippingAddress?.phoneNumber}
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
                      {order.cart?.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span className="flex items-center gap-3">
                            <img
                              src={item.productId?.images?.[0] || '/placeholder.png'}
                              alt={item.productId?.name || 'Deleted Product'}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span>
                              {item.productId?.name || 'Deleted Product'} × {item.quantity}
                            </span>
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-right font-bold text-gray-800">
                      Total: ₹{order.totalPrice}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No orders found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
