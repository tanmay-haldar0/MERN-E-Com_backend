import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard";
import ProductPageSkeleton from "../Components/ProductPageSkeleton";
import { addToCart, getCart } from "../redux/actions/cart";
import { toast } from "react-toastify";
import { FaCartPlus } from "react-icons/fa";

const ProductPage = () => {
  const { id } = useParams();
  const { homepageProducts = [] } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const demoProducts = [
  {
    imgSrc: "data:image/jpeg;base64,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",
    isSale: true,
    name: "Wireless Headphones",
    originalPrice: 99.99,
    salePrice: 79.99,
  },
  {
    imgSrc: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=300&q=80",
    isSale: false,
    name: "Smart Watch",
    originalPrice: 149.99,
    salePrice: null,
  },
  {
    imgSrc: "https://images.unsplash.com/photo-1585386959984-a415522e3fdd?auto=format&fit=crop&w=300&q=80",
    isSale: true,
    name: "Bluetooth Speaker",
    originalPrice: 59.99,
    salePrice: 39.99,
  },
  {
    imgSrc: "https://images.unsplash.com/photo-1610563166150-b34df4cb8bda?auto=format&fit=crop&w=300&q=80",
    isSale: true,
    name: "Gaming Mouse",
    originalPrice: 49.99,
    salePrice: 29.99,
  },
  {
    imgSrc: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=300&q=80",
    isSale: false,
    name: "Mechanical Keyboard",
    originalPrice: 89.99,
    salePrice: null,
  },
  {
    imgSrc: "https://images.unsplash.com/photo-1579427428692-1f0b6d01c3c5?auto=format&fit=crop&w=300&q=80",
    isSale: true,
    name: "Fitness Tracker",
    originalPrice: 69.99,
    salePrice: 54.99,
  },
];


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [variants, setVariants] = useState("");
  const [reviews, setReviews] = useState([
    {
      text: "Great Product , Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, quae nisi.",
      rating: 4.5,
      userName: "User1",
      userImage: "https://placehold.co/500",
    },
    {
      text: "Good Quality, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, quae nisi.",
      rating: 4,
      userName: "User2",
      userImage: "https://placehold.co/500",
    },
  ]);
  const [quantity, setQuantity] = useState(1);
  const [fullWidthImage, setFullWidthImage] = useState("");

  useEffect(() => {
    const existingProduct = homepageProducts.find((p) => p._id === id);

    if (existingProduct) {
      setProduct(existingProduct);
      setFullWidthImage(existingProduct.images?.[0] || existingProduct.imgSrc);
      setLoading(false);
    } else {
      axios
        .get(`${server}/product/get-product/${id}`)
        .then((res) => {
          const fetched = res.data.product;
          const fetchedProduct = Array.isArray(fetched) ? fetched[0] : fetched;
          setProduct(fetchedProduct);
          setFullWidthImage(
            fetchedProduct.images?.[0] || fetchedProduct.imgSrc
          );
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, homepageProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReviewSubmit = () => {
    if (review) {
      setReviews([
        ...reviews,
        {
          text: review,
          rating,
          userName: "User1",
          userImage: "https://example.com/user1.png",
        },
      ]);
      setReview("");
      setRating(0);
    }
  };

  const handleAddToCart = async (productId) => {
    const quantity = 1;
    const variant = variants && variants[0] ? variants[0] : null;

    try {
      const result = await dispatch(addToCart(productId, quantity, variant));

      if (result?.error) {
        toast.error(result.error.message || "Failed to add to cart");
      } else {
        toast.success("Product added to cart successfully");
        await dispatch(getCart());
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Handle buy now single product
  const handleBuyNow = () => {
    navigate(`/checkout/product/${product._id}`);
  };

  const renderStars = (rating) => {
    if (!rating) rating = 4.5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={`full-${i}`} />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" />);
    for (let i = stars.length; i < 5; i++)
      stars.push(<FaRegStar key={`empty-${i}`} />);

    return stars;
  };

  if (loading) return <ProductPageSkeleton />;

  if (!product)
    return (
      <div className="p-10 text-center text-lg font-semibold">
        Product not found
      </div>
    );

  const imageGallery = product.images || [
    product.imgSrc,
    "https://th.bing.com/th?id=OIP.J_jSjQfqmzyaRlUZcQ1RlAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    "https://th.bing.com/th/id/OIP.m_z7TZU1F3OLW5vcYT8DCgAAAA?w=222&h=180&c=7&r=0&o=5&pid=1.7",
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-14 mb-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:h-[500px] gap-6">
          {/* Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2">
            {/* Thumbnails */}
            <div className="flex flex-row lg:flex-col gap-2 justify-center lg:w-[90px]">
              {imageGallery.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Thumbnail ${index}`}
                  className="w-16 h-16 object-cover cursor-pointer rounded-md hover:scale-105 transition duration-300"
                  onClick={() => setFullWidthImage(imgSrc)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full">
              <img
                src={fullWidthImage}
                alt={product.name}
                className="w-full h-[300px] sm:h-[400px] lg:h-full object-cover rounded-lg shadow-md transition duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-500">{product.description}</p>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                ₹ {product.originalPrice?.toFixed(2)}
              </span>
              {product.salePrice && (
                <span className="text-lg sm:text-xl text-slate-400 line-through">
                  ₹ {product.salePrice?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center text-yellow-500">
              {renderStars(product?.rating)}
              <span className="ml-2 text-md font-semibold">
                {product.rating}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <label className="text-slate-500">Quantity:</label>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-primary text-white rounded hover:bg-blue-700"
              >
                -
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-primary text-white rounded hover:bg-blue-700"
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3">
              <button className="hidden w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
                Customize
              </button>
              <button
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>

            <button
              className="hidden sm:block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
              onClick={() => handleBuyNow()}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-20 flex flex-col lg:flex-row gap-6">
          {/* Write Review */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-bold">Write a Review</h2>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <FaStar />
                </span>
              ))}
              <span className="ml-2 font-medium">{rating}</span>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border p-3 rounded mt-3"
              placeholder="Write your review here..."
            />

            <button
              onClick={handleReviewSubmit}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>

          {/* Customer Reviews */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-bold">Customer Words</h2>
            <div className="mt-4 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex gap-3 items-start">
                      <img
                        src={rev.userImage}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{rev.userName}</h3>
                        <div className="flex text-yellow-500">
                          {renderStars(rev.rating)}
                        </div>
                        <p className="text-slate-600 mt-1">{rev.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">Similar Products</h2>
          <div className="flex overflow-x-auto whitespace-nowrap gap-3 mt-5 pb-2">
            {demoProducts.map((product, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px]">
                <ProductCard
                  imgSrc={product.imgSrc}
                  isSale={product.isSale}
                  productName={product.name}
                  price={product.originalPrice}
                  salePrice={product.salePrice}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-end items-center z-50 p-3">
        <button
          onClick={() => handleAddToCart(product._id)}
          className="flex flex-col items-center text-green-600"
        >
          <FaCartPlus />
          <span className="text-xs">Add</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex flex-col ml-8 items-center text-md bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Buy Now
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
