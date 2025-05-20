import React, { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Group, Image, Text, Transformer } from "react-konva";
import useImage from "use-image";
import { useCanvasStore } from "../hooks/useCanvasStore";

const Canvas2D = ({ config, elements, setElements, selectedId, setSelectedId }) => {
  const stageRef = useRef();
  const trRef = useRef();
  // const [elements, setElements] = useState([]);
  // const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(false);

  const { mask, canvasSize } = config;
  const strokeWidth = 1.5;
  const borderRadius = mask.borderRadius || 0;

  const addElement = useCallback((item) => {
    const id = `el-${Date.now()}`;

    if (item.type === "image") {
      // Load image to get natural dimensions
      const img = new window.Image();
      img.src = item.src;

      img.onload = () => {
        const maxDimension = 200; // max width or height
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Scale to fit maxDimension
        if (width > height) {
          if (width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        const newItem = {
          ...item,
          id,
          x: canvasSize.width / 2 - width / 2,
          y: canvasSize.height / 2 - height / 2,
          width,
          height,
          rotation: 0,
        };
        setElements((prev) => [...prev, newItem]);
        setSelectedId(id);
      };

      // If you want to handle load error, can add img.onerror here

    } else {
      // For non-images, default size
      const defaultWidth = 200;
      const defaultHeight = 200;
      const newItem = {
        ...item,
        id,
        x: canvasSize.width / 2 - defaultWidth / 2,
        y: canvasSize.height / 2 - defaultHeight / 2,
        width: defaultWidth,
        height: defaultHeight,
        rotation: 0,
      };
      setElements((prev) => [...prev, newItem]);
      setSelectedId(id);
    }
  }, [canvasSize]);


  // Drag & drop support
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    const parsed = JSON.parse(data);
    addElement(parsed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" && selectedId) {
      setElements((prev) => prev.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    stage.container().tabIndex = 1;
    stage.container().focus();
    stage.container().addEventListener("keydown", handleKeyDown);

    return () => {
      stage.container().removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);

  const CanvasElement = ({ el, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const [image] = useImage(el.src);

    useEffect(() => {
      if (isSelected && shapeRef.current && trRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    if (el.type === "image") {
      return (
        <Image
          image={image}
          {...el}
          ref={shapeRef}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({ ...el, x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />
      );
    }

    if (el.type === "text") {
      return (
        <Text
          {...el}
          fontSize={el.fontSize || 24}
          draggable
          ref={shapeRef}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({ ...el, x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
      );
    }

    return null;
  };

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  return (
    <div
      style={{
        width: canvasSize.width + strokeWidth * 2,
        height: canvasSize.height + strokeWidth * 2,
        margin: "auto",
        position: "relative",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
    >
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        ref={stageRef}
        style={{ display: "block", position: "relative", zIndex: 1 }}
        onClick={checkDeselect}
      >
        <Layer>
          <Group
            clipFunc={(ctx) => {
              const r = borderRadius;
              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(canvasSize.width - r, 0);
              ctx.quadraticCurveTo(canvasSize.width, 0, canvasSize.width, r);
              ctx.lineTo(canvasSize.width, canvasSize.height - r);
              ctx.quadraticCurveTo(canvasSize.width, canvasSize.height, canvasSize.width - r, canvasSize.height);
              ctx.lineTo(r, canvasSize.height);
              ctx.quadraticCurveTo(0, canvasSize.height, 0, canvasSize.height - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();

              if (mask.cutouts) {
                mask.cutouts.forEach((cutout) => {
                  ctx.rect(cutout.x, cutout.y, cutout.width, cutout.height);
                });
              }
              ctx.clip("evenodd");
            }}
          >
            <Rect
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
              fill="#fff"
              listening={false}
            />
            {elements.map((el) => (
              <CanvasElement
                key={el.id}
                el={el}
                isSelected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id)}
                onChange={(newEl) => {
                  setElements((prev) =>
                    prev.map((item) => (item.id === newEl.id ? newEl : item))
                  );
                }}
              />
            ))}
          </Group>
          {selectedId && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
              }
            />
          )}
        </Layer>
      </Stage>

      {/* Draw border in a separate layer above canvas to avoid clipping */}
      <svg
        width={canvasSize.width + strokeWidth * 2}
        height={canvasSize.height + strokeWidth * 2}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 2 }}
      >
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={canvasSize.width + strokeWidth - 1}
          height={canvasSize.height + strokeWidth - 1}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke="green"
          strokeWidth={strokeWidth}
          strokeDasharray="8 4"
        />
        {/* Draw cutouts with reddish background and dotted border */}
        {mask.cutouts?.map((cutout, i) => (
          <g key={i}>
            <rect
              x={cutout.x + strokeWidth / 2}
              y={cutout.y + strokeWidth / 2}
              width={cutout.width}
              height={cutout.height}
              fill="rgba(255, 0, 0, 0.2)"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Canvas2D;
