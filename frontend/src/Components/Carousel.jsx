import React, { useState, useEffect } from 'react';

const Carousel = () => {

    const items = [
        {
            image: 'https://plus.unsplash.com/premium_photo-1683619761464-6b7c9a2716a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzdCUyMGZvb2R8ZW58MHx8MHx8fDA%3D',
            alt: 'Slide 1',
            title: 'Eat Your Desired Fastfood',
            description: 'live for food',
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
            title: 'Explore the Indian Cusine',
            description: 'Dip in the ocean of Indian Food',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

   useEffect(() => {
  const interval = setInterval(() => {
    if (currentIndex === items.length - 1) {
      setCurrentIndex(0); // Go back to the first index
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }, 5000); // Change slide every 3 seconds

  return () => clearInterval(interval);
}, [items.length, currentIndex]);

    return (
        <div className="relative overflow-hidden w-full sm:h-72 mt-[52px]">
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div className="relative flex-shrink-0 w-full h-48 sm:h-72" key={index}>
                        <img src={item.image} alt={item.alt} className="w-full h-full object-cover overflow-hidden" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-full text-white bg-black bg-opacity-20 p-2">
                            <h3 className="text-xl sm:text-4xl font-semibold">{item.title}</h3>
                            <p className="text-xs sm:text-[15px] text-slate-200 ">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-1/3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;