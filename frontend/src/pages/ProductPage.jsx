import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Footer from "../Components/Footer";
import ProductCard from "../Components/ProductCard";
import { addToCart, getCart } from "../redux/actions/cart";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { id } = useParams();
  const { homepageProducts = [] } = useSelector((state) => state.product);
  const dispatch = useDispatch();

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

  if (loading) return <div className="p-10 text-center">Loading...</div>;

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
            <div className="flex flex-col sm:flex-row gap-3">
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

            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg">
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
            {[...Array(6)].map((_, i) => (
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

      <Footer />
    </div>
  );
};

export default ProductPage;
