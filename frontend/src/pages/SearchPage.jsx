import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer";
import { server } from "../server.js";
import { X } from "lucide-react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [rawProducts, setRawProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    const handlePopState = () => {
      if (isFilterOpen) {
        setIsFilterOpen(false);
        // Push current state back so that the page doesn't actually navigate
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (isFilterOpen) {
      // Push a new state so that back button becomes available
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFilterOpen]);

  return (
    <>
      <div className="max-w-[1300px] mx-auto sm:p-4 p-2 sm:mt-14 mt-8 rounded-lg">
        {/* Toggle Filter Button */}
        <div className="mb-4 flex mt-12 justify-end md:hidden">
          <button
            className="bg-blue-600 text-white  px-4 py-2 rounded-md"
            onClick={() => setIsFilterOpen(true)}
          >
            Filters
          </button>
        </div>

        <div className="flex">
          {/* Sidebar Filters */}
          <div
            className={`fixed inset-y-0 left-0 z-[100] w-3/4 max-w-xs bg-white border-r p-4 transform transition-transform duration-300 ease-in-out ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:translate-x-0 md:w-1/4 md:block`}
          >
            {/* Close Button (mobile only) */}
            <div className="md:hidden flex justify-end">
              <button
                className="mb-2 text-gray-700"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <h3 className="text-xl font-semibold mb-4">Filters</h3>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home</option>
              </select>
            </div>

            {/* Price */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Price Range
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Minimum Rating
              </label>
              <select
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

          {/* Overlay when sidebar is open (mobile only) */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black mt-8 bg-opacity-30 z-30 md:hidden"
              onClick={() => setIsFilterOpen(false)}
            ></div>
          )}

          {/* Products Grid */}
          <div className="w-full md:w-3/4 sm:p-4 p-2">
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
              <div className="grid grid-cols-2 md:grid-cols-5 sm:gap-4 gap-3">
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
                {"<"}
              </button>
              <span className="px-4 py-2">
                {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded-r-md"
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
