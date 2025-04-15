import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer.jsx";
import { server, imgServer } from "../server.js";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);
  const [loading, setLoading] = useState(false); // Add a loading state

  const fetchProducts = async (page = 1) => {
    setLoading(true); // Set loading to true when starting to fetch
    try {
      const { data } = await axios.get(
        `${server}/product/get-all-products?page=${page}&limit=${itemsPerPage}`
      );
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch =
      product.originalPrice >= selectedPriceRange[0] &&
      product.originalPrice <= selectedPriceRange[1];
    return categoryMatch && priceMatch;
  });

  const categories = ["All", "headphone", "mobile", "laptop", "watch"];

  return (
    <>
      <div className="max-w-[1200px] mx-auto p-4 rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Our Products
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4 bg-white shadow-md rounded-lg p-4 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Filters
            </h2>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">Price Range</h3>
              <input
                type="range"
                min="0"
                max="5000"
                value={selectedPriceRange[1]}
                className="w-full"
                onChange={(e) =>
                  setSelectedPriceRange([0, parseInt(e.target.value)])
                }
              />
              <div className="flex justify-between text-gray-700">
                <span>{selectedPriceRange[0]}</span>
                <span>{selectedPriceRange[1]}</span>
              </div>
            </div>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`text-gray-700 ${
                      selectedCategory === category ? "font-bold" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                {/* Loading Spinner */}
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      imgSrc={`${imgServer}${product.images[0]}`}
                      productName={product.name}
                      isSale={product.salePrice ? true : false}
                      price={product.originalPrice}
                      salePrice={product.salePrice}
                    />
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
