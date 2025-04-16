import React, { useState } from 'react';
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import LazyLoadImage from './LazyLoadImage';

const CartProduct = ({ imgSrc, name, price, rating }) => {
  const [quantity, setQuantity] = useState(1);

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

        <div className="flex items-center gap-2 mt-1">
          <button onClick={decreaseQuantity} className="px-2 py-0.5 text-sm bg-primary text-white rounded-md">-</button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-10 text-center border rounded-md text-sm"
          />
          <button onClick={increaseQuantity} className="px-2 py-0.5 text-sm bg-primary text-white rounded-md">+</button>
        </div>
      </div>

      <div className="text-primary text-xl sm:text-2xl cursor-pointer pl-2 sm:pl-4">
        <IoCloseSharp />
      </div>
    </div>
  );
};

export default CartProduct;
