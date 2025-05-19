import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Transformer, Group, Rect } from "react-konva";
import useImage from "use-image";

const CanvasStage = ({ template }) => {
  if (!template) return <div>Loading canvas...</div>;

  const { width, height, background, placeholderImage, mask } = template;
  const cutouts = mask?.cutouts || [];
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const fileInputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [canvasImages, setCanvasImages] = useState([
    {
      id: "default-user-image",
      src: placeholderImage,
      x: 50,
      y: 50,
      width: 200,
      height: 400,
      rotation: 0,
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [bgImage] = useImage(background);

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
        draggable={shapeProps.id !== "default-user-image"}
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;

    const droppedImage = JSON.parse(data);
    const newImage = {
      id: "img-" + Date.now(),
      src: droppedImage.src,
      x: width / 2 - 100,
      y: height / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
    };

    setCanvasImages((prev) => [...prev, newImage]);
    setSelectedId(newImage.id);
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const drawRoundedRectWithCutouts = (ctx) => {
    const r = mask?.radius || 0;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    cutouts.forEach(({ x, y, width: w, height: h, radius = 0 }) => {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    });

    ctx.clip("evenodd");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        id: "img-" + Date.now(),
        src: reader.result,
        x: width / 2 - 100,
        y: height / 2 - 100,
        width: 200,
        height: 200,
        rotation: 0,
      };
      setCanvasImages((prev) => [...prev, newImage]);
      setSelectedId(newImage.id);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      className={`overflow-hidden m-0 p-0 ${dragging
        ? "border-4 border-dashed border-blue-500"
        : "border border-gray-300"
        }`}
      style={{ width: `${width}px`, height: `${height}px`, margin: `5px` }}
    >
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={checkDeselect}
        onDblClick={(e) => {
          const isImage = canvasImages.some(
            (img) => e.target.attrs.id === img.id
          );
          if (!isImage) {
            fileInputRef.current?.click();
          }
        }}
        onDblTap={(e) => {
          const isImage = canvasImages.some(
            (img) => e.target.attrs.id === img.id
          );
          if (!isImage) {
            fileInputRef.current?.click();
          }
        }}
        onTap={checkDeselect}
        pixelRatio={window.devicePixelRatio}
      >
        <Layer>
          <Image
            image={bgImage}
            x={0}
            y={0}
            width={width}
            height={height}
            listening={false}
          />

          {cutouts.map((cutout, idx) => (
            <Rect
              key={`cutout-${idx}`}
              x={cutout.x}
              y={cutout.y}
              width={cutout.width}
              height={cutout.height}
              cornerRadius={cutout.radius || 0}
              stroke="red"
              strokeWidth={2}
              dash={[6, 4]}
              fill="rgba(255, 0, 0, 0.1)"
              listening={false}
            />
          ))}

          <Group clipFunc={drawRoundedRectWithCutouts}>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="white"
              listening={false}
            />

            {canvasImages.map((img) => (
              <CanvasImage
                key={img.id}
                shapeProps={img}
                isSelected={
                  img.id === selectedId && img.id !== "default-user-image"
                }
                onSelect={() =>
                  img.id !== "default-user-image" && setSelectedId(img.id)
                }
                onChange={(newAttrs) => {
                  setCanvasImages((imgs) =>
                    imgs.map((i) => (i.id === newAttrs.id ? newAttrs : i))
                  );
                }}
              />
            ))}
          </Group>

          {selectedId && selectedId !== "default-user-image" && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
              }
            />
          )}

          <Group listening={false}>
            <Rect
              x={0.6}
              y={0.6}
              width={width - 3}
              height={height - 3}
              stroke="black"
              strokeWidth={2}
              cornerRadius={mask?.radius || 0}
              shadowColor="black"
              shadowBlur={2}
              shadowOpacity={0.2}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasStage;
