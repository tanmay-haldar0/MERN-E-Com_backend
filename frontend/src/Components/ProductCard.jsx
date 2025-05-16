import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaCartPlus } from "react-icons/fa";
import { FaHeartCirclePlus } from "react-icons/fa6";
import LazyLoadImage from "./LazyLoadImage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, getCart } from "../redux/actions/cart"; // Action to add product to the cart
import { toast } from "react-toastify";

const ProductCard = ({
  id,
  imgSrc,
  isSale,
  productName,
  price,
  salePrice,
  rating,
  variants,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyNow = () => {
    navigate(`/checkout/product/${id}`);
  };
  // Function to render star ratings
  const renderStars = (rating) => {
    if (!rating) {
      rating = 4.5;
    }
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    // Add empty stars to make a total of 5 stars
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return stars;
  };

  // Add to Cart handler
  const handleAddToCart = async (productId) => {
    const quantity = 1;
    const variant = variants && variants[0] ? variants[0] : null;

    try {
      const result = await dispatch(addToCart(productId, quantity, variant));

      if (result?.error) {
        toast.error(result.error.message || "Failed to add to cart");
      } else {
        toast.success("Product added to cart successfully");
        await dispatch(getCart());
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div
      className="relative rounded-lg p-2 sm:w-[180px] h-[285px] sm:h-[310px] w-[165px] bg-white shadow-md hover:shadow-2xl duration-200 transform hover:scale-105 transition-all ease-out flex flex-col justify-center cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="flex flex-col h-full justify-around">
        <div className="relative">
          <LazyLoadImage
            src={imgSrc}
            alt={productName}
            className="rounded-md w-full bg-slate-200 sm:h-36 h-28 object-cover"
          />

          {/* Add to Cart Button */}
          <button
            className="absolute top-3 right-1 bg-blue-100 text-primary p-1 rounded-full shadow-md border border-primary hover:bg-blue-200 hover:text-green-600 hover:border-green-600 transition duration-300 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(id);
            }}
          >
            <FaCartPlus />
          </button>

          {/* Wishlist Button */}
          <button
            className="absolute top-10 right-1 bg-blue-100 text-primary p-1 rounded-full shadow-md border border-primary hover:bg-blue-200 hover:text-red-600 hover:border-red-600 transition duration-300 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(id); // You can replace this with your wishlist logic
            }}
          >
            <FaHeartCirclePlus />
          </button>
        </div>

        <h3 className="sm:text-md text-sm font-semibold mt-2 line-clamp-2 break-words">
          {productName}
        </h3>

        {isSale ? (
          <div className="flex items">
            <p className="sm:text-sm text-sm font-semibold text-primary">
              ₹{price}
            </p>
            <p className="sm:text-sm text-sm font-semibold text-slate-500 pl-2 line-through">
              ₹{salePrice}
            </p>
          </div>
        ) : (
          <p className="sm:text-sm text-xs font-semibold text-primary">
            ₹{price}
          </p>
        )}

        <div className="flex items-center text-yellow-500">
          {renderStars(rating)}
        </div>

        {isSale && (
          <div className="w-10 h-5 rounded-md bg-red-600 flex items-center justify-center absolute top-0 right-0">
            <p className="text-white text-sm font-medium">Sale</p>
          </div>
        )}

        <div className="sm:text-sm text-xs mt-1 text-slate-500 font-semibold">
          {isSale ? "Flat 50% off" : "Value for Price"}
        </div>

        {/* Buy Now Button */}
        <div className="flex items-center mt-2">
          <button
            className="btn w-full bg-primary p-2 rounded-md text-white font-medium text-xs sm:text-sm transition duration-200 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow();
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
