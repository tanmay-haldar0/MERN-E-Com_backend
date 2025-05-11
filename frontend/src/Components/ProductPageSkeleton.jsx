import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Full-page skeleton that matches the visual structure of ProductPage.
 * Tailwind is used only for spacing; Skeleton handles the shading/animation.
 */
const ProductPageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-14 mb-8 animate-pulse">
      {/* ── Top section ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:h-[500px] gap-6">
        {/* Image gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-2 justify-center lg:w-[90px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                width={64}
                height={64}
                className="rounded-md"
              />
            ))}
          </div>

          {/* Main image */}
          <Skeleton className="w-full h-[300px] sm:h-[400px] lg:h-full rounded-lg" />
        </div>

        {/* Product info panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between gap-4">
          <Skeleton height={32} width="80%" />        {/* title */}
          <Skeleton count={3} />                       {/* description */}
          <Skeleton height={28} width="30%" />        {/* price */}
          <Skeleton height={24} width="30%" />        {/* rating */}
          <Skeleton height={48} />                    {/* buttons */}
          <Skeleton height={48} />                    {/* buttons */}
        </div>
      </div>

      {/* ── Similar products strip ─────────────────────────────────── */}
      <div className="mt-20">
        <Skeleton height={28} width="30%" />          {/* heading */}
        <div className="flex overflow-x-auto gap-3 mt-5 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              width={160}
              height={180}
              className="flex-shrink-0 rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
