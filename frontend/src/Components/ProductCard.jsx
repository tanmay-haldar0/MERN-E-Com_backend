import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import LazyLoadImage from './LazyLoadImage';

const ProductCard = ({ imgSrc, isSale, productName, price, salePrice, rating }) => {
    const renderStars = (rating) => {

        if(!rating){
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

    return (
        <div className="relative rounded-lg p-2 bg-white shadow-md hover:shadow-2xl duration-200 transform hover:scale-105 transition-all ease-out">
            <div className="flex flex-col justify-between">
                <div className="">
                <LazyLoadImage src={imgSrc} alt={productName} className='rounded-md w-full bg-slate-200 sm:h-36 h-28 object-cover' />
                </div>
                <h3 className="sm:text-md text-sm font-semibold mt-2 ">{productName}</h3>
                {isSale ? (
                    <div className="flex items">
                        <p className="sm:text-sm text-xs font-semibold text-primary">₹{price}</p>
                        <p className="sm:text-sm text-xs font-semibold text-slate-500 pl-2 line-through">₹{salePrice}</p>
                    </div>
                ) : (
                    <p className="sm:text-sm text-xs font-semibold text-primary">₹{price}</p>
                )}
                <div className="flex items-center text-yellow-500">
                    {renderStars(rating)}
                </div>
                {isSale ? (
                    <p className="sm:text-sm text-xs mt-1 text-red-500 font-semibold">Flat 50% off</p>
                ) : (
                    <p className="sm:text-sm text-xs mt-1 text-slate-500 font-semibold">Value for Price</p>
                )}
                <div className="flex items-center mt-2">
                    <button className='btn w-full bg-primary p-2 rounded-md text-white font-medium text-xs sm:text-sm transition duration-200 transform hover:scale-105'>Buy Now</button>
                </div>
                {isSale ? (
                    <div className="w-10 h-5 rounded-md bg-red-600 flex items-center justify-center absolute top-0 right-0">
                        <p className='text-white text-sm font-medium'>Sale</p>
                    </div>
                ) : ""}
            </div>
        </div>
    );
}

export default ProductCard;