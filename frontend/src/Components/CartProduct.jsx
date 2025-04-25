import React, { useEffect, useRef, useState } from 'react';
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import LazyLoadImage from './LazyLoadImage';
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getCart } from '../redux/actions/cart';

const CartProduct = ({ imgSrc, name, price, rating, getQuantity, onRemove, productId, variant }) => {
  const dispatch= useDispatch();
  const [quantity, setQuantity] = useState(getQuantity);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const debounceRef = useRef(null);
  const lastSyncedQtyRef = useRef(getQuantity);

  const updateQuantityBackend = async (newQty) => {
    if (newQty === lastSyncedQtyRef.current) return;

    try {
      setIsUpdating(true);
      await axios.put(`${server}/cart/update-quantity`, {
        productId,
        quantity: newQty,
        ...(variant ? { variant } : {})
      },{withCredentials: true}).then(response => {
        // Handle success
        toast.success("Quantity updated");
        dispatch(getCart());
        // console.log('Quantity updated:', response.data);
      }).catch(error => {
        // Handle error
        toast.error(error.message);
        // console.error('Error updating quantity:', error);
      });
      lastSyncedQtyRef.current = newQty;
    } catch (error) {
      toast.error("Could not update quantity. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Trigger backend call when quantity changes, with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (quantity !== lastSyncedQtyRef.current) {
        updateQuantityBackend(quantity);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [quantity]);

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} />);
    if (half) stars.push(<FaStarHalfAlt key="half" />);
    while (stars.length < 5) stars.push(<FaRegStar key={`empty-${stars.length}`} />);
    return stars;
  };

  return (
    <>
      <div className="w-full h-28 sm:h-32 bg-white p-2 flex items-center justify-between rounded-lg shadow-md transition hover:scale-[101%]">
        <LazyLoadImage
          src={imgSrc}
          alt={name}
          className="w-[80px] sm:w-[100px] h-full object-cover rounded-md"
        />

        <div className="flex flex-col justify-between h-full px-2 sm:px-4 w-full">
          <div>
            <h3 className="text-sm sm:text-base font-semibold truncate">{name}</h3>
            <p className="text-sm sm:text-base text-primary font-semibold">₹{price}</p>
            <div className="flex text-yellow-500 text-sm">{renderStars(rating)}</div>
          </div>

          <div className="flex items-center gap-2 mt-1 relative">
            <button
              onClick={decreaseQuantity}
              className="px-2 py-0.5 text-sm bg-primary text-white rounded-md"
              disabled={isUpdating}
            >-</button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-10 text-center border rounded-md text-sm"
            />
            <button
              onClick={increaseQuantity}
              className="px-2 py-0.5 text-sm bg-primary text-white rounded-md"
              disabled={isUpdating}
            >+</button>

            {isUpdating && (
              <div className="absolute right-[-24px] top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div
          className="text-primary text-xl sm:text-2xl cursor-pointer pl-2 sm:pl-4"
          onClick={() => setShowConfirm(true)}
        >
          <IoCloseSharp />
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Remove this product?</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove <strong>{name}</strong> from your cart?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-1 text-sm text-gray-600 border rounded hover:bg-gray-100"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                onClick={() => {
                  setShowConfirm(false);
                  onRemove?.();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartProduct;
