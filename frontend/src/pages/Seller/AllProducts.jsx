import React, { useEffect, useState } from "react";
import SideNav from "../../Components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import {  getShopAllProducts } from "../../redux/actions/product";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { imgServer } from "../../server.js"

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { sellerProducts=[] } = useSelector((state) => state.product);
  const products = sellerProducts;
  console.log(products)
  const seller = useSelector((state) => state.seller.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dispatch(getShopAllProducts(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (products) {
      setAllProducts(products);
      setLoading(false);
    }
  }, [products]);

  // Filtered Products
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-14 flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              📦 All Products
            </h1>
            <p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
              View and manage your products here.
            </p>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all w-full sm:w-auto"
            onClick={() => navigate("/seller/create-product")}
          >
            + Add Product
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-6 relative w-full mt-4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineSearch className="text-gray-500 text-xl" />
          </span>

          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-10 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose className="text-xl" />
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white w-full rounded-lg shadow p-2 flex flex-row flex-wrap justify-between items-center gap- hover:shadow-md transition-all duration-300"
                >
                  {/* Image + Name + Category */}
                  <div className="flex items-center gap-2 flex-shrink">
                    <img
                      src={`${product.images[0]}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="leading-tight max-w-[130px]">
                      <h2 className="text-sm font-semibold text-gray-800 break-words">
                        {product.name}
                      </h2>
                      <p className="text-xs text-gray-600">{product.category}</p>
                    </div>

                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="bg-green-500 text-white text-lg p-1.5 rounded hover:bg-green-600 transition">
                      <MdEdit />
                    </button>
                    <button className="bg-red-500 text-white text-lg p-1.5 rounded hover:bg-red-600 transition">
                      <MdOutlineDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">No products found</p>
            )}
          </div>

        )}
      </div>
    </div >
  );
};


export default AllProducts;
