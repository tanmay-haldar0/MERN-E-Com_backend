import React, { useState, useEffect } from 'react';

const Carousel = () => {
    const items = [
        {
            image: 'https://plus.unsplash.com/premium_photo-1683619761464-6b7c9a2716a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzdCUyMGZvb2R8ZW58MHx8MHx8fDA%3D',
            alt: 'Slide 1',
            title: 'Eat Your Desired Fastfood',
            description: 'Live for food',
        },
        {
            image: 'https://media.istockphoto.com/id/1244678181/photo/aloe-vera-drink.webp?a=1&b=1&s=612x612&w=0&k=20&c=Xtk4VcJ2FPNscy74rPrPIvqTxf0wIdAL4L0EPXvbJFY=',
            alt: 'Slide 2',
            title: 'Drink Healthy',
            description: 'Chill with a lemonade',
        },
        {
            image: 'https://media.istockphoto.com/id/1279889705/photo/table-top-view-of-indian-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=CGIhW2oj5fRqSu5_wPZOqNItTEsjXfBmM1NA6MXpHZE=',
            alt: 'Slide 3',
            title: 'Explore the Indian Cuisine',
            description: 'Dip in the ocean of Indian Food',
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
        <div className="relative w-full h-42 sm:h-68 md:h-72 lg:h-[300px] overflow-hidden mt-[52px] rounded-lg shadow">
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
