import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer.jsx";
import { AiOutlineClose } from "react-icons/ai";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { getAllProducts } from "../redux/actions/product"; // <-- import action

const Shop = () => {
  const dispatch = useDispatch();
  const {
    homepageProducts = [],
    isLoading,
    success,
    totalPages,
  } = useSelector((state) => state.product); // Correct state
  // console.log("Products from Redux:", products);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);

  const categories = ["All", "headphone", "mobile", "laptop", "watch"];

  useEffect(() => {
    dispatch(getAllProducts(currentPage, itemsPerPage));
  }, [dispatch, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = homepageProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch =
      product.originalPrice >= selectedPriceRange[0] &&
      product.originalPrice <= selectedPriceRange[1];
    return categoryMatch && priceMatch;
  });

  const ProductCardSkeleton = () => {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-4 space-y-3">
        <div className="bg-gray-200 h-40 w-full rounded-md" />
        <div className="bg-gray-200 h-4 w-3/4 rounded-md" />
        <div className="bg-gray-200 h-4 w-1/2 rounded-md" />
      </div>
    );
  };

  return (
    <>
      <div className="max-w-[1300px] mx-auto p-4 rounded-lg">
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

        <div className="flex flex-col lg:flex-row gap-6 justify-stretch w-full">
          {/* Sidebar (Desktop) */}
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
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                {Array.from({ length: 20 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      imgSrc={product.images[0]}
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
            <div className="flex justify-center items-center mt-6 gap-2 text-sm sm:text-base">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaAngleLeft />
              </button>
              <span className="px-2 text-center">Page {currentPage}</span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={homepageProducts.length < itemsPerPage}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer for Mobile Filters */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setDrawerOpen(false)}
          ></div>

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
