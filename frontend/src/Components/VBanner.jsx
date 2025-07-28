import React from 'react';

const VBanner = ({ bgImgUrl, mClass, tColor }) => {
    return (
        <div style={{
            backgroundImage: `url(${bgImgUrl})`, objectFit:"cover", // Replace with your image // Adjust height as needed
        }} className={`h-[620px] ${mClass} hidden sm:block bg-no-repeat object-cover mt-6 w-[250px] rounded-lg shadow-lg text-center ${tColor}`}>
            <div className='flex justify-center items-center flex-col rounded-md w-full h-full' style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }}>
                <h2 className="text-xl font-bold">Special Promotion!</h2>
                <p className="mt-2">Get 50% off on your first purchase.</p>
                <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400 transition">
                    Shop Now
                </button>
            </div>
        </div>
    );
}

export default VBanner;