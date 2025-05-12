import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="w-[165px] border p-2 rounded-md shadow-sm">
      <Skeleton height={120}  />
      <Skeleton height={20} width={`80%`} className="mt-2" />
      <Skeleton height={20} width={`60%`} />
      <Skeleton height={20} width={`40%`} />
    </div>
  );
};

export default ProductCardSkeleton;
