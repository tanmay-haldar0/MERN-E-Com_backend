import React, { useState, useEffect } from "react";
import { TbShoppingBagPlus } from "react-icons/tb";
import CartProduct from "../Components/CartProduct";
import CartCheckout from "../Components/CartCheckout";
import Footer from "../Components/Footer.jsx";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [noCartItem, setNoCartItem] = useState(false);

  // Simulated loading (replace with actual API call)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set to false after API call completes
    }, 1500);
  }, []);

  const product = [
    {
      imgSrc:
        "https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo=",
      name: "Medium Sized Pizza",
      price: "69.49",
    },
    {
      imgSrc:
        "https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4=",
      name: "Large Burger",
      price: "29.49",
    },
    {
      imgSrc:
        "https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M=",
      name: "Veg Dumplings",
      price: "49.99",
    },
  ];

  return (
    <>
      <div className="max-w-[1740px] mx-auto px-4">
        <h1 className="text-xl sm:text-3xl pt-6 mt-14 font-semibold text-slate-800 text-left">
          Your Cart :
        </h1>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !noCartItem ? (
          // Full Cart View
          <div className="flex flex-col md:flex-row justify-between gap-6 mt-2">
            {/* Products List */}
            <div className="w-full md:w-3/5 flex flex-col gap-4">
              {product.map((item, index) => (
                <CartProduct
                  key={index}
                  imgSrc={item.imgSrc}
                  name={item.name}
                  price={item.price}
                />
              ))}
            </div>

            {/* Checkout Sidebar */}
            <div className="w-full md:w-[300px] lg:w-[280px] xl:w-[260px] self-start">
              <CartCheckout />
            </div>
          </div>
        ) : (
          // Empty Cart View
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center justify-center text-center">
              <TbShoppingBagPlus className="text-8xl sm:text-[150px] text-slate-600 mb-4" />
              <p className="text-base sm:text-lg text-slate-600 mb-3">
                Your Cart is Empty, Add products to continue shopping
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all duration-200">
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
