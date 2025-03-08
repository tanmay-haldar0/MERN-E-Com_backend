import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'
import ProductCard from '../Components/ProductCard'
import Footer from '../Components/Footer.jsx'

const ProductPage = () => {
  const [rating, setRating] = useState(5)

  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState([
    {
      text: 'Great Product , Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, quae nisi.', 
      rating: 4.5,
      userName: 'User1',
      userImage: 'https://placehold.co/500'
    },
    {
      text: 'Good Quality, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, quae nisi.',
      rating: 4,
      userName: 'User2',
      userImage: 'https://placehold.co/500'
    }
  ])

  const handleReviewSubmit = () => {
    const reviewWithRating = {
      text: review,
      rating,
      userName: 'User1',
      userImage: 'https://example.com/user1.png'
    }

    setReviews([...reviews, reviewWithRating])
    setReview('')
    setRating(0)

    if (review) {
      setReviews([...reviews, review])
      setReview('')
    }
  }

  const { id } = useParams()
  const imageGallery = [
    'https://th.bing.com/th/id/OIP.Eep5dR0_b8W6Sr42-afJIAHaHa?w=198&h=198&c=7&r=0&o=5&pid=1.7',
    'https://th.bing.com/th?id=OIP.J_jSjQfqmzyaRlUZcQ1RlAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    'https://th.bing.com/th/id/OIP.m_z7TZU1F3OLW5vcYT8DCgAAAA?w=222&h=180&c=7&r=0&o=5&pid=1.7',
    'https://th.bing.com/th/id/OIP.1m5FWEr7F8NuSAE6L4ASfAHaHa?w=216&h=216&c=7&r=0&o=5&pid=1.7'
  ]

  const [fullWidthImage, setFullWidthImage] = useState(imageGallery[0])
  const [quantity, setQuantity] = useState(1)

  const products = [
    {
      id: 1,
      imgSrc:
        'https://th.bing.com/th/id/OIP.ciuVLqG4L1s0An4zq27nuwHaHa?w=198&h=198&c=7&r=0&o=5&pid=1.7',
      productName: 'Nike Lebron 16 Low',
      price: 150.0,
      salePrice: 199.55,
      description:
        'The Lebron 16 Low is built for the biggest and most stylish moments. Lorem ipsum dolor sit amet consectetur adipisicing elit...',
      rating: 4.5,
      isSale: true
    }
  ]

  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return <div>Product not found</div>
  }

  const renderStars = rating => {
    if (!rating) {
      rating = 4.5
    }
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key='half' />)
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />)
    }

    return stars
  }

  return (
    <div className=''>
      <div className='max-w-7xl mx-auto p-6 mt-14 mb-8'>
        <div className='flex h-[500px] p-3 space-x-8'>
          {/* Thumbnail Images */}
          <div className='flex flex-col space-y-2 w-[90px]'>
            {imageGallery.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Thumbnail ${index}`}
                className='w-full cursor-pointer rounded-md transform hover:scale-105 transition duration-300'
                onClick={() => setFullWidthImage(imgSrc)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='w-1/2 h-full'>
            <img
              src={fullWidthImage}
              alt={product.productName}
              className='w-full h-full object-cover rounded-lg shadow-md transform hover:scale-105 transition duration-300'
            />
          </div>

          {/* Product Info */}
          <div className='w-1/2 h-full flex flex-col justify-between pl-5'>
            <h1 className='text-4xl font-bold text-gray-800'>
              {product.productName}
            </h1>
            <p className='text-md text-gray-500'>{product.description}</p>
            <div className='flex items-center space-x-4'>
              <span className='text-2xl font-bold text-blue-600'>
                ₹ {product.price.toFixed(2)}
              </span>
              <span className='text-xl font-bold text-slate-400 line-through'>
                ₹ {product.salePrice.toFixed(2)}
              </span>
            </div>

            {/* Rating */}
            <div className='flex items-center my-2'>
              <div className='flex items-center text-yellow-500'>
                {renderStars(product.rating)}
                <span className='ml-2 text-lg font-semibold text-pretty'>
                  {product.rating}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className='my-4 flex items-center space-x-2'>
              <label className='text-lg font-light text-slate-500'>
                Quantity:
              </label>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className='border rounded p-2 bg-primary text-white hover:bg-blue-700 transition duration-200'
              >
                -
              </button>
              <span className='border rounded p-2 bg-gray-100'>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className='border rounded p-2 bg-primary text-white hover:bg-blue-700 transition duration-200'
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className='w-full flex justify-between'>
              <button className='w-[49%] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105'>
                Customize
              </button>
              <button className='w-[49%] bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105'>
                Add to Cart
              </button>
            </div>

            <button className='bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg  w-full mt-4 transition duration-200 transform hover:scale-105'>
              Buy Now
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className='mt-[100px] flex'>
          <div className='w-1/2 pr-4'>
            <h2 className='text-2xl font-bold'>Write a Review</h2>
            <div className='flex items-center my-2'>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <FaStar />
                </span>
              ))}
              <span className='ml-2 text-lg font-semibold text-pretty'>
                {rating}
              </span>
            </div>

            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              className='border rounded w-full p-2 mt-5'
              placeholder='Write your review here...'
            />
            <button
              onClick={handleReviewSubmit}
              className='bg-blue-600 text-white px-4 py-2 rounded mt-5 transition duration-200 transform hover:scale-105'
            >
              Submit Review
            </button>
          </div>
          <div className='w-1/2 pl-4'>
            <h2 className='text-2xl font-bold'>Customers Words</h2>
            <div className='mt-5'>
              {reviews.length > 0 ? (
                <div>
                  {reviews.map((rev, index) => (
                    <div key={index} className='border-b py-2'>
                      <div className='flex flex-col'>
                        <div className='flex items-center justify-start mb-3'>
                          <img
                            src={rev.userImage}
                            alt='User'
                            className='w-8 h-8 rounded-full mr-2'
                          />
                          <div className='flex flex-col'>
                            <span className='text-md font-semibold'>
                              {rev.userName}
                            </span>
                            <div className='flex text-sm items-center text-yellow-500'>
                              {renderStars(rev.rating)}
                            </div>
                          </div>
                        </div>
                        <span className='ml-2 text-md text-slate-500 font-semibold text-pretty'>
                          {rev.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No reviews yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold'>Similar Products</h2>
          <div className='grid grid-cols-6 gap-4 mt-5'>
            {/* Example similar products */}
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
            <ProductCard
              imgSrc={product.imgSrc}
              isSale={product.isSale}
              productName={product.productName}
              price={product.price}
              salePrice={product.salePrice}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductPage
