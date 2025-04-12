import React, { useEffect, useState } from 'react';
import SideNav from '../../Components/SideNav';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../redux/actions/product';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const [allProducts, setAllProducts] = useState([]);

    const { products } = useSelector((state) => state.product);
    const seller = useSelector((state) => state.seller.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllProducts(seller._id));
    }, [dispatch, seller._id]);

    useEffect(() => {
        if (products) {
            setAllProducts(products);
        }
    }, [products]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNav />
            <div className="flex-1 p-8 ml-64 mt-16">
                <div className="flex justify-between">
                    <div className="">
                        <h1 className="text-4xl font-bold text-gray-900">📦 All Products</h1>
                        <p className="text-gray-600 mb-6">View and manage your products here.</p>
                    </div>
                    {/* Add Product Button */}
                    <div className="mb-6">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                        onClick={() => navigate("/seller/create-product")}
                       >
                           + Add Product
                        </button>
                    </div>
                </div>

                {/* Product List Layout */}
                <div className="space-y-4">
                    {allProducts.length > 0 ? (
                        allProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={`http://localhost:5000/uploads/${product.images[0]}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h2 className="text-md font-bold text-gray-800">{product.name}</h2>
                                        <p className="text-sm text-gray-600">{product.category}</p>
                                    </div>
                                </div>

                                {/* Update and Delete Buttons */}
                                <div className="flex space-x-4">
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
                                        Update
                                    </button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
