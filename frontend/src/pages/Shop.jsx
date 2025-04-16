import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer.jsx";
import { server, imgServer } from "../server.js";
import { AiOutlineClose } from "react-icons/ai";
import { FaBarsStaggered } from "react-icons/fa6";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);
  const [loading, setLoading] = useState(false);

  const categories = ["All", "headphone", "mobile", "laptop", "watch"];

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/product/get-all-products?page=${page}&limit=${itemsPerPage}`
      );

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch =
      product.originalPrice >= selectedPriceRange[0] &&
      product.originalPrice <= selectedPriceRange[1];
    return categoryMatch && priceMatch;
  });

  return (
    <>
      <div className="max-w-[1200px] mx-auto p-4 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 text-center">
          Our Products
        </h1>

        {/* Filter Button for Mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md"
            onClick={() => setDrawerOpen(true)}
          >
            <div className="flex justify-between items-center">
            <FaBarsStaggered />
            <span className="text-sm mx-1">Filters</span>
            </div>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar (Visible on Desktop) */}
          <div className="hidden lg:block w-full lg:w-1/4 bg-white shadow-md rounded-lg p-4 h-fit">
            <Filters
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 grid-cols-2  md:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      imgSrc={`${imgServer}${product.images[0]}`}
                      productName={product.name}
                      isSale={!!product.salePrice}
                      price={product.originalPrice}
                      salePrice={product.salePrice}
                      rating={product.rating}
                    />
                  ))
                ) : (
                  <p className="text-center mt-2 col-span-full text-gray-600">
                    No products found.
                  </p>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 gap-2 text-sm sm:text-base">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-2 text-center">
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

      {/* Drawer for Mobile Filters */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setDrawerOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative bg-white w-4/5 max-w-sm h-full p-4 shadow-lg z-50">
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setDrawerOpen(false)}
            >
              <AiOutlineClose />
            </button>
            <Filters
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

const Filters = ({
  selectedPriceRange,
  setSelectedPriceRange,
  selectedCategory,
  handleCategoryChange,
  categories,
}) => (
  <>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
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
        onChange={(e) => setSelectedPriceRange([0, parseInt(e.target.value)])}
      />
      <div className="flex justify-between text-sm text-gray-700 mt-1">
        <span>{selectedPriceRange[0]}</span>
        <span>{selectedPriceRange[1]}</span>
      </div>
    </div>

    <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
      <div className="flex flex-wrap sm:flex-col gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-sm text-gray-700 ${
              selectedCategory === category ? "font-bold" : ""
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  </>
);

export default Shop;
