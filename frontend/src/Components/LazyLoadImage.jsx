// src/Components/LazyLoadImage.js
import React, { useEffect, useRef, useState } from 'react';

const LazyLoadImage = ({ src, alt, className }) => {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  // Define the observer outside of the useEffect
  const observer = useRef();

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Use the current observer reference to unobserve
      observer.current.unobserve(imgRef.current);
    }
  };

  useEffect(() => {
    // Initialize the observer and store it in the ref
    observer.current = new IntersectionObserver(handleIntersection);
    if (imgRef.current) {
      observer.current.observe(imgRef.current);
    }
    return () => {
      if (imgRef.current) {
        observer.current.unobserve(imgRef.current);
      }
    };
  }, [imgRef]);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
};

export default LazyLoadImage;