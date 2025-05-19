import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Transformer, Group, Rect } from "react-konva";
import useImage from "use-image";

import phoneCoverTemplate from "../templates/phoneCoverTemplate";

const CANVAS_WIDTH = 250;
const CANVAS_HEIGHT = 500;
const CAMERA_CUTOUT = {
  x: 20,
  y: 20,
  width: 90, // example width of camera hole
  height: 120, // example height of camera hole (rectangular)
};

const CanvasStage = () => {
  const stageRef = useRef(null);
  const trRef = useRef(null);

  const [dragging, setDragging] = useState(false);
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
  const [selectedId, setSelectedId] = useState(canvasImages[0].id);

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  const CanvasImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const [image] = useImage(shapeProps.src);
    const shapeRef = useRef();

    useEffect(() => {
      if (isSelected && shapeRef.current && trRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

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

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;

    const droppedImage = JSON.parse(data);

    const newImage = {
      id: "img-" + Date.now(),
      src: droppedImage.src,
      x: (CANVAS_WIDTH - 200) / 2,
      y: (CANVAS_HEIGHT - 200) / 2,
      width: 200,
      height: 200,
      rotation: 0,
    };

    setCanvasImages((prev) => [...prev, newImage]);
    setSelectedId(newImage.id);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        overflow: "hidden",
        border: dragging ? "3px dashed blue" : "1px solid #ccc",
        transition: "border 0.2s ease",
        margin: "auto",
      }}
    >
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={stageRef}
        onClick={checkDeselect}
        onTap={checkDeselect}
      >
        <Layer>
          {/* Background phone template image */}
          <Image
            image={useImage(phoneCoverTemplate.background)[0]}
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            listening={false}
          />

          {/* Masked group with rounded rectangle and camera cutout */}
          <Group
            clipFunc={(ctx) => {
              const r = 20;

              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(CANVAS_WIDTH - r, 0);
              ctx.quadraticCurveTo(CANVAS_WIDTH, 0, CANVAS_WIDTH, r);
              ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - r);
              ctx.quadraticCurveTo(
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                CANVAS_WIDTH - r,
                CANVAS_HEIGHT
              );
              ctx.lineTo(r, CANVAS_HEIGHT);
              ctx.quadraticCurveTo(0, CANVAS_HEIGHT, 0, CANVAS_HEIGHT - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();

              // Cut out the camera hole by using 'evenodd' fill rule
              roundedRect(
                ctx,
                CAMERA_CUTOUT.x,
                CAMERA_CUTOUT.y,
                CAMERA_CUTOUT.width,
                CAMERA_CUTOUT.height,
                10
              );

              ctx.clip("evenodd");
            }}
          >
            {/* Phone cover background color inside mask */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#FFFFFF" // light grey color for phone body
              listening={false}
            />

            {/* Draggable Images inside masked area */}
            {canvasImages.map((img) => (
              <CanvasImage
                key={img.id}
                shapeProps={img}
                isSelected={
                  img.id === selectedId && img.id !== "default-user-image"
                }
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
              />
            ))}

            {/* Draw static dark grey rectangle over camera hole to cover image below */}
            <Rect
              x={CAMERA_CUTOUT.x}
              y={CAMERA_CUTOUT.y}
              width={CAMERA_CUTOUT.width}
              height={CAMERA_CUTOUT.height}
              fill="#6699cc" // dark grey color
              listening={false}
            />
          </Group>

          {/* Transformer for selected image */}
          {selectedId && selectedId !== "default-user-image" && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasStage;
