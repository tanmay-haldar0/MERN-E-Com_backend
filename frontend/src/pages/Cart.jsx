import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbShoppingBagPlus } from "react-icons/tb";
import CartProduct from "../Components/CartProduct";
import CartCheckout from "../Components/CartCheckout";
import { MdDeleteForever } from "react-icons/md";
import Footer from "../Components/Footer.jsx";
import { clearCart, getCart, removeFromCart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, cart, error } = useSelector((state) => state.cart);

  const [showModal, setShowModal] = useState(false); // Modal state

  const cartItems = Array.isArray(cart?.products) ? cart.products : [];
  const totalPrice = cart?.totalPrice || 0;
  const totalQuantity = cart?.totalQuantity || 0;

  const handleClearCart = async () => {
    try {
      dispatch(clearCart());
      setShowModal(false);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to clear cart");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeFromCart(productId));
      await dispatch(getCart());
      if (error) toast.error(`Error: ${error}`);
      else toast.success("Product removed successfully");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-[1740px] mx-auto px-4">
        {/* Header with Clear Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-16 gap-4">
          <h1 className="text-xl sm:text-3xl font-semibold text-slate-800">
            Your Cart :
          </h1>
          {cartItems.length !== 0 ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-500 text-white px-2 py-1 text-sm rounded-md hover:bg-red-600 transition-all duration-200"
            >
              <span className="flex items-center gap-1">
                <MdDeleteForever />
                Clear Cart
              </span>
            </button>
          ) : (
            ""
          )}
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Skeleton for cart items */}
            <div className="w-full md:w-3/5 flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-md animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skeleton for checkout section */}
            <div className="w-full md:w-[300px] lg:w-[280px] xl:w-[450px] self-start">
              <div className="p-4 border rounded-md animate-pulse space-y-3">
                <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded mt-4"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mt-10">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center justify-center text-center">
              <TbShoppingBagPlus className="text-8xl sm:text-[150px] text-slate-600 mb-4" />
              <p className="text-base sm:text-lg text-slate-600 mb-3">
                Your Cart is Empty, Add products to continue shopping
              </p>
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all duration-200"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full justify-between md:flex-row gap-4 mb-5 mt-2">
            {/* Product List */}
            <div className="w-full md:w-3/5 flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <CartProduct
                  key={item._id || index}
                  imgSrc={item.productId?.images?.[0] || ""}
                  name={item.productId?.name || "Unknown Product"}
                  price={
                    item.productId?.salePrice ??
                    item.productId?.originalPrice ??
                    0
                  }
                  productId={item.productId?._id}
                  getQuantity={item.quantity}
                  variant={item.variant}
                  onRemove={() => handleRemoveFromCart(item.productId?._id)}
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This will remove all items from your cart.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
