import React, { useEffect } from "react";
import ProductCard from "../Components/ProductCard";
import Banner from "../Components/Banner";
import VBanner from "../Components/VBanner";
import CategoryCard from "../Components/CategoryCard";
import Carousel from "../Components/Carousel";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/product.js";
import ProductCardSkeleton from "../Components/ProductCardSkeleton.jsx";
import FlashSaleBanner from "../Components/FlashSaleBanner.jsx";
import PromoBannerBlock from "../Components/PromoBannerBlock.jsx";

const Home = () => {
  const dispatch = useDispatch();

  const {
    homepageProducts = [],
    isLoading,
    success,
    totalPages,
  } = useSelector((state) => state.product); // Correct state
  const products = homepageProducts;
  // const isLoading =true;
  let newProducts = [];
  let popularProducts = [];

  if (products.length >= 20) {
    newProducts = products.slice(0, 10);
    popularProducts = products.slice(10, 20);
  } else {
    // Not enough products, show same list for both
    newProducts = products.slice(0, 10); // up to 10 or whatever is available
    popularProducts = products.slice(0, 10);
  }

  const categories = [
    {
      ctImg:
        "https://media.istockphoto.com/id/180756294/photo/wallet.jpg?s=612x612&w=0&k=20&c=sc6I6KsEbiv9Y4BtKji8w5rBYono2X63-ipfhYk6Ytg=",
      ctName: "Wallet",
    },
    {
      ctImg:
        "https://www.photoland.in/wp-content/uploads/2022/08/keychain-Hexagon-front-1-600x600.jpg",
      ctName: "Keychain",
    },
    {
      ctImg:
        "https://m.media-amazon.com/images/I/61fok09o6TL.jpg",
      ctName: "Water Bottle",
    },
    {
      ctImg:
        "https://assets.winni.in/product/primary/2022/5/60843.jpeg?dpr=2&w=220",
      ctName: "Coffee Mug",
    },
    {
      ctImg:
        "https://media.istockphoto.com/id/180756294/photo/wallet.jpg?s=612x612&w=0&k=20&c=sc6I6KsEbiv9Y4BtKji8w5rBYono2X63-ipfhYk6Ytg=",
      ctName: "Wallet",
    },
    {
      ctImg:
        "https://www.photoland.in/wp-content/uploads/2022/08/keychain-Hexagon-front-1-600x600.jpg",
      ctName: "Keychain",
    },
    {
      ctImg:
        "https://m.media-amazon.com/images/I/61fok09o6TL.jpg",
      ctName: "Water Bottle",
    },
    {
      ctImg:
        "https://assets.winni.in/product/primary/2022/5/60843.jpeg?dpr=2&w=220",
      ctName: "Coffee Mug",
    },
    {
      ctImg:
        "https://media.istockphoto.com/id/180756294/photo/wallet.jpg?s=612x612&w=0&k=20&c=sc6I6KsEbiv9Y4BtKji8w5rBYono2X63-ipfhYk6Ytg=",
      ctName: "Wallet",
    },
    {
      ctImg:
        "https://www.photoland.in/wp-content/uploads/2022/08/keychain-Hexagon-front-1-600x600.jpg",
      ctName: "Keychain",
    },
    {
      ctImg:
        "https://m.media-amazon.com/images/I/61fok09o6TL.jpg",
      ctName: "Water Bottle",
    },

  ];

  const currentPage = 1;
  useEffect(() => {
    dispatch(getAllProducts(currentPage, 20));
  }, [dispatch, currentPage]);

  const bannerUrl2 =
    "https://media.istockphoto.com/id/2055023629/photo/4k-beautiful-color-gradient-background-with-noise-abstract-pastel-holographic-blurred-grainy.jpg?s=612x612&w=0&k=20&c=l65_0xqN76oYzun9lKf_abnquQ7i8HF3pGkCnVbPKsE=";
  const vBannerUrl =
    "https://www.shutterstock.com/image-photo/christmas-frame-golden-gifts-red-600nw-2510868443.jpg";
  const vBannerUrl2 =
    "https://media.istockphoto.com/id/1210469631/vector/happy-holi-festival-poster-design.jpg?s=612x612&w=0&k=20&c=2EX1zNh03M9JdF8Gu8qJKCk0YKdKrV0bCKJBDz2dETw=";


  return (
    <div className="max-w-[1740px] mx-auto">
      <Carousel />

      <FlashSaleBanner endTime="2025-08-05T23:59:59" />

      {/* Promo Banner Grid Blocks */}
      <section className="my-5 px-3 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PromoBannerBlock
            title="🧴 Beauty Bonanza"
            subtitle="Up to 60% off on brands"
            icon="💄"
            gradient="bg-gradient-to-tr from-pink-600 to-rose-400"
          />
          <PromoBannerBlock
            title="📱 Tech Mania"
            subtitle="Smartphones and gadgets"
            icon="📱"
            gradient="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400"
          />
          <PromoBannerBlock
            title="🎁 Gift Zone"
            subtitle="Perfect gifts for all occasions"
            icon="🎉"
            gradient="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500"
          />
        </div>
      </section>


      {/* Category Heading */}
      <h1 className="mt-8 pl-3 sm:pl-10 sm:text-2xl text-lg font-semibold">
        Category
      </h1>
      <div className="sm:mt-2 sm:px-8 lg:px-10 w-full h-28 flex items-center hide-scrollbar sm:overflow-x-hidden overflow-x-auto overflow-y-hidden">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            ctImg={category.ctImg}
            ctName={category.ctName}
          />
        ))}
      </div>

      {/* New Product Heading and grid */}
      <div className="sm:mt-5 mt-2 sm:pl-10 px-3 flex items-center justify-between">
        <h1 className="sm:text-2xl text-lg font-semibold">New Products</h1>
        <Link to={"/shop"}>
          <button className="btn bg-primary font-medium text-white text-sm sm:text-md flex items-center justify-center p-1 rounded-3xl px-3 sm:mr-8">
            See More <FaArrowRight className="ml-2" />
          </button>
        </Link>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        {isLoading
          ? (<div className="w-full sm:m-4 m-2 grid grid-cols-2 md:grid-cols-5 sm:gap-4 gap-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>)
          : (
            <div className="grid px-2 sm:px-5  mt-5 grid-cols-2 md:grid-cols-5  gap-4 sm:gap-3 md:gap-4">
              {newProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  id={product._id}
                  imgSrc={product.images?.[0]}
                  isSale={!!product.salePrice}
                  productName={product.name}
                  price={product.originalPrice}
                  salePrice={product.salePrice}
                />
              ))}

            </div>
          )}

        <VBanner mClass={"mr-8"} tColor={"text-white"} bgImgUrl={vBannerUrl2} />
      </div>

      {/* Promo Banner Grid Blocks */}
      <section className="my-5 mt-10 px-3 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <PromoBannerBlock
            title="🔥 Hot Trends"
            subtitle="Shop the latest fashion"
            icon="👗"
            gradient="bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400"
          />
          <PromoBannerBlock
            title="🎒 Back to School"
            subtitle="Essentials starting ₹199"
            icon="🎓"
            gradient="bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300"
          />
          <PromoBannerBlock
            title="🏋️‍♂️ Fitness Deals"
            subtitle="Gear up for your workout"
            icon="💪"
            gradient="bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500"
          />
        </div>
      </section>


      {/* Popular Products Heading and grid */}
      <div className="flex items-center justify-center h-full mb-16">
        <div className="sm:w-1/4 hidden sm:flex items-center justify-center">
          <VBanner mClass={"mr-0 mt-8"} tColor={"text-white"} bgImgUrl={vBannerUrl} />
        </div>

        <div className="sm:w-3/4 w-full">
          <div className="sm:mt-5 mt-2 sm:pl-10 px-3 flex items-center justify-between">
            <h1 className="sm:text-2xl text-lg font-semibold">
              Popular Products
            </h1>
            <Link to={"/shop"}>
              <button className="btn bg-primary font-medium text-white text-sm sm:text-md flex items-center justify-center p-1 rounded-3xl px-3 sm:mr-8">
                See More <FaArrowRight className="ml-2" />
              </button>
            </Link>
          </div>

          <div className="h-full">
            {isLoading
              ? (<div className="w-full mt-4 grid grid-cols-2 md:grid-cols-5 sm:gap-4 gap-3">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>)
              : (
                <div className="grid px-2 sm:px-5 mt-5 grid-cols-2 md:grid-cols-5  gap-4 sm:gap-3">
                  {newProducts.map((product, index) => (
                    <ProductCard
                      key={index}
                      id={product._id}
                      imgSrc={product.images?.[0]}
                      isSale={!!product.salePrice}
                      productName={product.name}
                      price={product.originalPrice}
                      salePrice={product.salePrice}
                    />
                  ))}

                </div>
              )}
          </div>
        </div>
      </div>

      <Footer />
    </div >
  );
};

export default Home;
