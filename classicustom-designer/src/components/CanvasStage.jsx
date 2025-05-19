import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";

import phoneCoverTemplate from "../templates/phoneCoverTemplate";

const CanvasImage = ({ shapeProps, isSelected, onSelect, onChange, trRef }) => {
  const [image] = useImage(shapeProps.src);
  const shapeRef = useRef();

  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, trRef]);

  return (
    <Image
      image={image}
      {...shapeProps}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        });
      }}
    />
  );
};

const CanvasStage = () => {
  const stageRef = useRef(null);
  const trRef = useRef(null);

  const [backgroundImage] = useImage(phoneCoverTemplate.background);

  const [canvasImages, setCanvasImages] = useState([
    {
      id: "default-user-image",
      src: phoneCoverTemplate.placeholderImage,
      x: 50,
      y: 50,
      width: 200,
      height: 400,
      rotation: 0,
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;

    const droppedImage = JSON.parse(data);

    const newImage = {
      id: "img-" + Date.now(),
      src: droppedImage.src,
      x: pointerPos.x - 100,
      y: pointerPos.y - 100,
      width: 200,
      height: 200,
      rotation: 0,
    };

    setCanvasImages((prev) => [...prev, newImage]);
    setSelectedId(newImage.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Stage
      width={300}
      height={600}
      ref={stageRef}
      style={{ border: "1px solid #ccc" }}
      onClick={checkDeselect}
      onTap={checkDeselect}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Layer>
        {/* Background */}
        {backgroundImage && (
          <Image
            image={backgroundImage}
            x={0}
            y={0}
            width={300}
            height={600}
            listening={false}
            draggable={false}
          />
        )}

        {/* Canvas Images */}
        {canvasImages.map((img) => (
          <CanvasImage
            key={img.id}
            shapeProps={img}
            isSelected={img.id === selectedId && img.id !== "default-user-image"}
            onSelect={() => {
              if (img.id !== "default-user-image") setSelectedId(img.id);
            }}
            onChange={(newAttrs) => {
              setCanvasImages((images) =>
                images.map((image) =>
                  image.id === newAttrs.id ? newAttrs : image
                )
              );
            }}
            trRef={trRef}
          />
        ))}

        {/* Transformer */}
        {selectedId && selectedId !== "default-user-image" && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
            }}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasStage;
