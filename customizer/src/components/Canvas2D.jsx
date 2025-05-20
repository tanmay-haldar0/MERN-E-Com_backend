import React, { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Group, Image, Text, Transformer } from "react-konva";
import useImage from "use-image";

const Canvas2D = ({ config, elements, setElements, selectedId, setSelectedId }) => {
  const stageRef = useRef();
  const trRef = useRef();
  const [dragging, setDragging] = useState(false);

  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  const { mask, canvasSize } = config;
  const strokeWidth = 1.5;
  const borderRadius = mask.borderRadius || 0;

  const addElement = useCallback(
    (item) => {
      const id = `el-${Date.now()}`;

      if (item.type === "image") {
        const img = new window.Image();
        img.src = item.src;

        img.onload = () => {
          const maxDimension = 200;
          let width = img.naturalWidth;
          let height = img.naturalHeight;

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
      } else {
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
    },
    [canvasSize, setElements, setSelectedId]
  );

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

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = stageScale;

    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  const resetView = () => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  };

  const CanvasElement = ({ el, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const [image] = useImage(el.src);

    useEffect(() => {
      if (isSelected && shapeRef.current && trRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    const commonProps = {
      ...el,
      ref: shapeRef,
      draggable: true,
      onClick: onSelect,
      onTap: onSelect,
      onDragEnd: (e) => {
        onChange({ ...el, x: e.target.x(), y: e.target.y() });
      },
      onTransformEnd: () => {
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
      },
    };

    if (el.type === "image") {
      return <Image image={image} {...commonProps} />;
    }

    if (el.type === "text") {
      return <Text fontSize={el.fontSize || 24} {...commonProps} />;
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
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={stageScale > 1}
      >
        <Layer>
          <Group
            clipFunc={(ctx) => {
              const r = borderRadius;
              const w = canvasSize.width;
              const h = canvasSize.height;

              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();

              if (mask.cutouts) {
                mask.cutouts.forEach((cutout) => {
                  const { x, y, width, height, cutoutRadius = 0 } = cutout;
                  const cr = Math.min(cutoutRadius, width / 2, height / 2);
                  ctx.moveTo(x + cr, y);
                  ctx.lineTo(x + width - cr, y);
                  ctx.quadraticCurveTo(x + width, y, x + width, y + cr);
                  ctx.lineTo(x + width, y + height - cr);
                  ctx.quadraticCurveTo(x + width, y + height, x + width - cr, y + height);
                  ctx.lineTo(x + cr, y + height);
                  ctx.quadraticCurveTo(x, y + height, x, y + height - cr);
                  ctx.lineTo(x, y + cr);
                  ctx.quadraticCurveTo(x, y, x + cr, y);
                  ctx.closePath();
                });
              }

              ctx.clip("evenodd");
            }}
          >
            <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="#fff" listening={false} />
            {elements.map((el) => (
              <CanvasElement
                key={el.id}
                el={el}
                isSelected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id)}
                onChange={(newEl) => {
                  setElements((prev) => prev.map((item) => (item.id === newEl.id ? newEl : item)));
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

          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            stroke="green"
            strokeWidth={strokeWidth}
            dash={[8, 4]}
            cornerRadius={borderRadius}
            listening={false}
           />

          {mask.cutouts?.map((cutout, i) => (
            <Rect
              key={i}
              x={cutout.x}
              y={cutout.y}
              width={cutout.width}
              height={cutout.height}
              fill="rgba(255, 0, 0, 0.2)"
              stroke="red"
              strokeWidth={2}
              dash={[4, 4]}
              cornerRadius={cutout.cutoutRadius}
              listening={false}
             />
))}

        </Layer>
      </Stage>

      {/* <svg
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
              rx={cutout.cutoutRadius}
              ry={cutout.cutoutRadius}
              strokeDasharray="4 4"
            />
          </g>
        ))}
      </svg> */}

      <button
        onClick={resetView}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 10,
          backgroundColor: "#f0f0f0",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Recenter
      </button>
    </div>
  );
};

export default Canvas2D;
