import React, { useEffect, useState } from "react";
import SideNav from "../../Components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../redux/actions/product";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { MdEdit, MdOutlineDelete  } from "react-icons/md";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { products } = useSelector((state) => state.product);
  const seller = useSelector((state) => state.seller.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dispatch(getAllProducts(seller._id));
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
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 p-8 ml-64 mt-16">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              📦 All Products
            </h1>
            <p className="text-gray-600 mb-4">
              View and manage your products here.
            </p>
          </div>
          <div className="mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
              onClick={() => navigate("/seller/create-product")}
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Search Input with Search and Clear Icons */}
        <div className="mb-6 relative w-full">
          {/* Search Icon (left) */}
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineSearch className="text-gray-500 text-xl" />
          </span>

          {/* Input */}
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clear Icon (right) */}
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
          <div className="space-y-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                      <h2 className="text-md font-bold text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-green-500 text-xl text-white px-2 py-2 rounded-md hover:bg-green-600 transition-all duration-300">
                    <MdEdit />
                    </button>
                    <button className="bg-red-500 text-xl text-white px-2 py-2 rounded-md hover:bg-red-600 transition-all duration-300">
                    <MdOutlineDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">
                No products found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
