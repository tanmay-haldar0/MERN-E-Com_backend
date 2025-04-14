import React, { useState } from 'react';
import SideNav from '../../Components/SideNav';

const dummyAnalytics = {
  totalSales: 15000,
  totalOrders: 200,
  totalProducts: 50,
  orderStatus: {
    processing: 50,
    shipped: 120,
    delivered: 25,
    cancelled: 5,
  },
  topProducts: [
    { name: 'Product A', sales: 5000 },
    { name: 'Product B', sales: 4000 },
    { name: 'Product C', sales: 3000 },
  ],
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(dummyAnalytics);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 p-8 ml-64 mt-16">
        <h1 className="text-4xl font-bold text-gray-900">📊 Analytics</h1>
        <p className="text-gray-600 mb-6">View detailed analytics of your store's performance.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
            <p className="text-2xl font-bold text-gray-900">₹{analytics.totalSales}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
          </div>

          {/* Total Products */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Total Products</h2>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Order Status Summary</h2>
            <div className="mt-4 space-y-3">
              {Object.keys(analytics.orderStatus).map((status) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{status}</span>
                  <span className="font-bold text-gray-800">
                    {analytics.orderStatus[status]} Orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Top Products</h2>
            <div className="mt-4 space-y-3">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-bold text-gray-800">₹{product.sales}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
