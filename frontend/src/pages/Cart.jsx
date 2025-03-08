import React from 'react'
import { TbShoppingBagPlus } from 'react-icons/tb'
import CartProduct from '../Components/CartProduct'
import CartCheckout from '../Components/CartCheckout'
import Footer from '../Components/Footer.jsx'

const Cart = () => {
  const product = [
    {
      imgSrc:
        'https://media.istockphoto.com/id/153444470/photo/pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmp-5NGZUXWag2EGOiwfXQN3Q4TvBYcYJBb8AXFaybo='
      ,
      name: 'Medium Sized Pizza',
      price: '69.49'
    },
    {
      imgSrc:
        'https://media.istockphoto.com/id/1399371766/photo/bacon-cheeseburger-on-a-toasted-bun.webp?a=1&b=1&s=612x612&w=0&k=20&c=958m1hYPSZn6eNLh00huIwEC85FhGz0pCtIbtaEq5f4='
      ,
      name: 'Large Burger',
      price: '29.49'
    },
    {
      imgSrc:
        'https://media.istockphoto.com/id/1252605699/photo/veg-momos-on-black-slate-table-top-momos-is-the-popular-dish-of-indian-tibetan-chinese.webp?a=1&b=1&s=612x612&w=0&k=20&c=qil7GGAkjXOSIu6NB19XIlqAy2CYf4U0arY0c5uy05M='
      ,
      name: 'Veg Dumplings',
      price: '49.99'
    }
  ]
  const noCartItem = false
  return (
    <div className='max-w-[1740px] mx-auto'>
      <h1 className='text-xl sm:text-3xl pl-4 pt-2 ml-1 sm:ml-5 font-semibold  mt-16 text-slate-800'>
        Cart
      </h1>

      {!noCartItem /* Full Cart */ ? (
        <div className='flex flex-col md:ml-5 h-full justify-between sm:p-2 md:flex-row sm:flex-col'>
          <div className='w-3/5 flex flex-col items-center justify-center'>
            {product.map((item, index) =>
              <CartProduct
                key={index}
                imgSrc={item.imgSrc}
                name={item.name}
                price={item.price}
              />
            )}
          </div>
          <CartCheckout />
        </div>
      ) : (
        /* Empty Cart */
        <div className='flex items-center justify-center'>
          <div className='h-200px sm:h-[500px] flex items-center flex-col justify-center'>
            <TbShoppingBagPlus className='text-8xl sm:text-[150px] text-slate-600' />
            <p className='text-sm text-center sm:text-lg text-slate-600'>
              Your Cart is Empty, Add products to continue shopping
            </p>
            <button className='btn bg-primary text-white px-2 p-1 mb-2 sm:px-4 sm:p-2 mt-2 rounded-md '>
              Shop Now
            </button>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  )
}

export default Cart
