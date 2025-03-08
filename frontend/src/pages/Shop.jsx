import React, { useState } from 'react';
import ProductCard from '../Components/ProductCard';

const Shop = () => {
  const products = [
    {
      imgSrc: 'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=',
      isSale: true,
      productName: 'Veg Dumplings',
      price: 29.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=',
      isSale: false,
      productName: 'Medium Sized Pizza',
      price: 69.49,
      category: 'Pizza',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1050109420/photo/bedmi-poori-daal-kachori.jpg?s=612x612&w=0&k=20&c=8zpScH9IANsomHG4VsPDNq1aJmVXJWKzSrF8Mttwf_Y=',
      isSale: true,
      productName: 'Delicious Kochuri',
      price: 49.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1208794199/photo/the-original-stabucks-coffee-for-their-customer-at-the-starbucks-reserve-roastery-in-shanghai.webp?a=1&b=1&s=612x612&w=0&k=20&c=-l3KzfjcZlWR_TkXW_9U-kLxKTYpBKidsecbvQ55mro=',
      isSale: true,
      productName: 'Delicious Coffee',
      price: 29.99,
      salePrice: 49.99,
      category: 'Beverage',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=',
      isSale: false,
      productName: 'Burger large size',
      price: 19.99,
      category: 'Burger',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=',
      isSale: true,
      productName: 'Veg Dumplings',
      price: 29.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=',
      isSale: false,
      productName: 'Medium Sized Pizza',
      price: 69.49,
      category: 'Pizza',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1050109420/photo/bedmi-poori-daal-kachori.jpg?s=612x612&w=0&k=20&c=8zpScH9IANsomHG4VsPDNq1aJmVXJWKzSrF8Mttwf_Y=',
      isSale: true,
      productName: 'Delicious Kochuri',
      price: 49.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1208794199/photo/the-original-stabucks-coffee-for-their-customer-at-the-starbucks-reserve-roastery-in-shanghai.webp?a=1&b=1&s=612x612&w=0&k=20&c=-l3KzfjcZlWR_TkXW_9U-kLxKTYpBKidsecbvQ55mro=',
      isSale: true,
      productName: 'Delicious Coffee',
      price: 29.99,
      salePrice: 49.99,
      category: 'Beverage',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=',
      isSale: false,
      productName: 'Burger large size',
      price: 19.99,
      category: 'Burger',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=',
      isSale: true,
      productName: 'Veg Dumplings',
      price: 29.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=',
      isSale: false,
      productName: 'Medium Sized Pizza',
      price: 69.49,
      category: 'Pizza',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1050109420/photo/bedmi-poori-daal-kachori.jpg?s=612x612&w=0&k=20&c=8zpScH9IANsomHG4VsPDNq1aJmVXJWKzSrF8Mttwf_Y=',
      isSale: true,
      productName: 'Delicious Kochuri',
      price: 49.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1208794199/photo/the-original-stabucks-coffee-for-their-customer-at-the-starbucks-reserve-roastery-in-shanghai.webp?a=1&b=1&s=612x612&w=0&k=20&c=-l3KzfjcZlWR_TkXW_9U-kLxKTYpBKidsecbvQ55mro=',
      isSale: true,
      productName: 'Delicious Coffee',
      price: 29.99,
      salePrice: 49.99,
      category: 'Beverage',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=',
      isSale: false,
      productName: 'Burger large size',
      price: 19.99,
      category: 'Burger',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=',
      isSale: true,
      productName: 'Veg Dumplings',
      price: 29.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=',
      isSale: false,
      productName: 'Medium Sized Pizza',
      price: 69.49,
      category: 'Pizza',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1050109420/photo/bedmi-poori-daal-kachori.jpg?s=612x612&w=0&k=20&c=8zpScH9IANsomHG4VsPDNq1aJmVXJWKzSrF8Mttwf_Y=',
      isSale: true,
      productName: 'Delicious Kochuri',
      price: 49.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1208794199/photo/the-original-stabucks-coffee-for-their-customer-at-the-starbucks-reserve-roastery-in-shanghai.webp?a=1&b=1&s=612x612&w=0&k=20&c=-l3KzfjcZlWR_TkXW_9U-kLxKTYpBKidsecbvQ55mro=',
      isSale: true,
      productName: 'Delicious Coffee',
      price: 29.99,
      salePrice: 49.99,
      category: 'Beverage',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=',
      isSale: false,
      productName: 'Burger large size',
      price: 19.99,
      category: 'Burger',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=',
      isSale: true,
      productName: 'Veg Dumplings',
      price: 29.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=',
      isSale: false,
      productName: 'Medium Sized Pizza',
      price: 69.49,
      category: 'Pizza',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1050109420/photo/bedmi-poori-daal-kachori.jpg?s=612x612&w=0&k=20&c=8zpScH9IANsomHG4VsPDNq1aJmVXJWKzSrF8Mttwf_Y=',
      isSale: true,
      productName: 'Delicious Kochuri',
      price: 49.99,
      salePrice: 99.99,
      category: 'Appetizer',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1208794199/photo/the-original-stabucks-coffee-for-their-customer-at-the-starbucks-reserve-roastery-in-shanghai.webp?a=1&b=1&s=612x612&w=0&k=20&c=-l3KzfjcZlWR_TkXW_9U-kLxKTYpBKidsecbvQ55mro=',
      isSale: true,
      productName: 'Delicious Coffee',
      price: 29.99,
      salePrice: 49.99,
      category: 'Beverage',
    },
    {
      imgSrc: 'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=',
      isSale: false,
      productName: 'Burger large size',
      price: 19.99,
      category: 'Burger',
    },
  ];

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000]);

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const priceMatch = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
    return categoryMatch && priceMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Categories and price ranges
  const categories = ['All', 'Pizza', 'Burger', 'Appetizer', 'Salad', 'Beverage', 'Desserts', 'Drinks', 'Snacks'];

  return (
    <div className='max-w-[1200px] mx-auto p-4 rounded-lg'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-8 text-center'>Our Menu</h1>
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Filters Sidebar */}
        <div className='w-full md:w-1/4 bg-white shadow-md rounded-lg p-4 h-fit'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Filters</h2>
          <div className='mb-6 p-4 bg-gray-100 rounded-lg shadow-md'>
            <h3 className='font-semibold text-gray-800 mb-2'>Price Range</h3>
            <input
              type='range'
              min='0'
              max='1000'
              value={selectedPriceRange[0]}
              className='w-full'
              onChange={(e) => setSelectedPriceRange([parseInt(e.target.value), selectedPriceRange[1]])}
            />
            <div className='flex justify-between text-gray-700'>
              <span>{selectedPriceRange[0]}</span>
              <span>{selectedPriceRange[1]}</span>
            </div>
          </div>
          <div className='mb-6 p-4 bg-gray-100 rounded-lg shadow-md'>
            <h3 className='font-semibold text-gray-800 mb-2'>Category</h3>
            <div className='flex flex-col space-y-2'>
              {categories.map(category => (
                <button 
                  key={category} 
                  className={`text-gray-700 ${selectedCategory === category ? 'font-bold' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='w-full md:w-3/4'>
          <div className='grid grid-cols-4 gap-6'>
            {currentItems.map((product, index) => (
              <ProductCard
                key={index}
                imgSrc={product.imgSrc}
                isSale={product.isSale}
                productName={product.productName}
                price={product.price}
                salePrice={product.salePrice}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex justify-center mt-8 gap-2'>
            <button
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className='flex items-center px-4'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
