import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer";
import { server } from "../server.js";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [rawProducts, setRawProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100000],
    rating: 0,
  });

  const PRODUCTS_PER_PAGE = 20;

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/product/search`, {
        params: { q: query, page: currentPage },
      });
      setRawProducts(data.products);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query?.trim()) {
      fetchSearchResults();
    }
  }, [query, currentPage]);

  useEffect(() => {
    // Apply filters
    const filtered = rawProducts.filter((product) => {
      const inCategory =
        !filters.category || product.category === filters.category;
      const inPriceRange =
        product.originalPrice >= filters.priceRange[0] &&
        product.originalPrice <= filters.priceRange[1];
      const meetsRating = product.rating >= filters.rating;

      return inCategory && inPriceRange && meetsRating;
    });

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  }, [filters, rawProducts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      priceRange:
        name === "minPrice"
          ? [Number(value), prev.priceRange[1]]
          : [prev.priceRange[0], Number(value)],
    }));
  };

  const handlePagination = (pageNumber) => {
    setSearchParams({ q: query, page: pageNumber });
  };

  // Paginate filtered products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <>
      <div className="max-w-[1300px] mx-auto p-4 mt-14 rounded-lg flex">
        {/* Sidebar Filters */}
        <div className="w-1/4 p-4 border-r">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
              {/* Add more as needed */}
            </select>
          </div>

          {/* Price */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <input
              type="number"
              name="minPrice"
              value={filters.priceRange[0]}
              onChange={handlePriceChange}
              className="w-full border rounded-md p-2 mb-2"
              placeholder="Min Price"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.priceRange[1]}
              onChange={handlePriceChange}
              className="w-full border rounded-md p-2"
              placeholder="Max Price"
            />
          </div>

          {/* Rating */}
          <div className="mt-4">
            <label htmlFor="rating" className="block text-sm font-medium mb-2">Minimum Rating</label>
            <select
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="w-full border rounded-md p-2"
            >
              <option value="0">All Ratings</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-3/4 p-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-center">
            Search Results for "{query}"
          </h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
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
                <p className="text-center col-span-full text-gray-600">
                  No products found.
                </p>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded-l-md"
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-r-md"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
