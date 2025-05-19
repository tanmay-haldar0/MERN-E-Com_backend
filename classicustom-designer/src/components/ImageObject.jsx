import React, { useRef, useEffect, useState } from "react";
import { Image } from "react-konva";

const useImage = (src) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => setImage(img);
  }, [src]);
  return image;
};

export default function ImageObject({ shapeProps, isSelected, onSelect, onChange }) {
  const imageRef = useRef();
  const img = useImage(shapeProps.src);

  return (
    <Image
      image={img}
      {...shapeProps}
      id={shapeProps.id}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      ref={imageRef}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = imageRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale to 1 after applying size changes
        node.scaleX(1);
        node.scaleY(1);

        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}
