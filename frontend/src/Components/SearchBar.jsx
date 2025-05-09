import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ showMobileSearch, setShowMobileSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const searchBarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${server}/product/search-suggestions?query=${query}`
        );
        setSuggestions(res.data.suggestions || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Suggestion fetch error", err);
      }
    }, 300);
  }, [query]);

  // Close dropdown and mobile overlay when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMobileSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
      setShowDropdown(false);
      setShowMobileSearch(false);
    }
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]);
    setShowDropdown(false);
    setShowMobileSearch(false);
    navigate(`/product/${id}`);
  };

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (showMobileSearch) {
      // Push a state to the browser history
      window.history.pushState({ mobileSearch: true }, "");

      const handlePopState = (event) => {
        setShowMobileSearch(false);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [showMobileSearch]);

  return (
    <div className="relative w-full max-w-md" ref={searchBarRef}>
      {/* Desktop: Inline search */}
      <form onSubmit={handleSubmit} className="hidden md:block relative">
        <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          placeholder="Search products..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setShowDropdown(true)}
          className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <FaTimes
            onClick={clearQuery}
            className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600"
            size={20}
          />
        )}
      </form>

      {/* Mobile: Fullscreen Overlay */}
      {showMobileSearch && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col p-4 overflow-hidden"
          style={{ maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <FaTimes
              size={24}
              className="text-gray-600 cursor-pointer"
              onClick={() => setShowMobileSearch(false)}
            />
          </div>

          <form onSubmit={handleSubmit} className="relative mb-4">
            <FaSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={query}
              placeholder="Search products..."
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length && setShowDropdown(true)}
              className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {query && (
              <FaTimes
                onClick={clearQuery}
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600"
                size={20}
              />
            )}
          </form>

          {suggestions.length > 0 && (
            <ul
              className="w-full border border-gray-200 rounded-md shadow-md max-h-64 overflow-auto"
              ref={dropdownRef}
            >
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(item._id)}
                >
                  <img
                    src={item?.images[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Desktop: Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-64 overflow-auto hidden md:block"
          ref={dropdownRef}
        >
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(item._id)}
            >
              <img
                src={item?.images[0] || "/placeholder.png"}
                alt={item.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-sm font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
