import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbShoppingBagPlus } from "react-icons/tb";
import CartProduct from "../Components/CartProduct";
import CartCheckout from "../Components/CartCheckout";
import Footer from "../Components/Footer.jsx";
import { getCart } from "../redux/actions/cart";

const Cart = () => {
  const dispatch = useDispatch();

  const { isLoading, cart, error } = useSelector((state) => state.cart);

  const cartItems = Array.isArray(cart?.products) ? cart.products : [];
  const totalPrice = cart?.totalPrice || 0;
  const totalQuantity = cart?.totalQuantity || 0;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-[1740px] mx-auto px-4">
        <h1 className="text-xl sm:text-3xl pt-6 mt-14 font-semibold text-slate-800 text-left">
          Your Cart :
        </h1>

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-10">{error}</div>
        ) : cartItems.length === 0 ? (
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
        ) : (
          // Full Cart View
          <div className="flex flex-col w-full justify-between md:flex-row gap-4 mb-5 mt-2">
            {/* Products List */}
            <div className="w-full md:w-3/5 flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <CartProduct
                  key={item._id || index}
                  imgSrc={item.productId?.images?.[0] || ""}
                  name={item.productId?.name || "Unknown Product"}
                  price={item.productId?.salePrice ?? item.productId?.originalPrice ?? 0}
                  quantity={item.quantity}
                  variant={item.variant}
                />
              ))}
            </div>

            {/* Checkout Sidebar */}
            <div className="w-full md:w-[300px] lg:w-[280px] xl:w-[450px] self-start">
              <CartCheckout
                cartItems={cartItems}
                totalPrice={totalPrice}
                totalQuantity={totalQuantity}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
