import React, { useState, useEffect } from 'react';

const Carousel = () => {
    const items = [
        {
            image: 'https://www.optamark.com/blog/wp-content/uploads/2023/08/banner-5.jpg',
            alt: 'Slide 1',
            title: 'Customized Water Bottle ',
            description: 'Stay hydrated in style',
        },
        {
            image: 'https://www.jasani.ae/web/image/175076/Bags%20Factory%20Website%20Header%20%282%29%20%281%29%20%281%29.png',
            alt: 'Slide 2',
            title: 'New Bags Collection',
            description: 'Carry the bags with style',
        },
        {
            image: 'https://www.themessycorner.in/cdn/shop/collections/Mens_wallet_-_Mobile-02_1200x1200_crop_center.png?v=1691585887',
            alt: 'Slide 2',
            title: 'Customized Wallets',
            description: 'Keep your essentials organized',
        },
        {
            image: 'https://www.optamark.com/blog/wp-content/uploads/2023/09/banner-3.jpg',
            alt: 'Slide 2',
            title: 'Classic Cofee Mug Collection',
            description: 'Sip your coffee in style',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <div className="relative w-full h-42 sm:h-68 md:h-72 lg:h-[300px] overflow-hidden mt-[62px] rounded-lg shadow">
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-42 sm:h-68 md:h-72 lg:h-[300px] relative">
                        <img
                            src={item.image}
                            alt={item.alt}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
                            <h3 className="text-lg sm:text-2xl md:text-4xl font-bold text-white">{item.title}</h3>
                            <p className="text-xs sm:text-sm md:text-base text-slate-200 mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots / Pagination */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-600 scale-110' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
