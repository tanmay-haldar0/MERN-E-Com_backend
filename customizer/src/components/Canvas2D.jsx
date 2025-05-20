import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text, Transformer, Group, Rect } from "react-konva";
import useImage from "use-image";

const Canvas2D = ({ config, elements, setElements, selectedId, setSelectedId }) => {
  const stageRef = useRef();
  const trRef = useRef();
  const containerRef = useRef();

  const { mask, canvasSize } = config;
  const strokeWidth = 1.5;
  const borderRadius = mask?.borderRadius || 0;

  // Stage size to fit container
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  // Zoom & pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  // Spacebar detection for pan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") setIsPanning(true);
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space") setIsPanning(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update stage size when container resizes
  // Center the canvas in the viewport
  const centerCanvas = (containerWidth, containerHeight) => {
    const offsetX = (containerWidth - canvasSize.width * scale) / 2;
    const offsetY = (containerHeight - canvasSize.height * scale) / 2;
    setPosition({ x: offsetX, y: offsetY });
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setStageSize({ width: rect.width, height: rect.height });
        centerCanvas(rect.width, rect.height); // <-- center canvas after sizing
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [canvasSize.width, canvasSize.height, scale]); // depend on canvas size & scale

  // Zoom on wheel
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  // Enable dragging stage only if panning (spacebar) or two-finger touch
  const handleMouseDown = (e) => {
    if (isPanning || e.evt.touches?.length === 2) {
      stageRef.current.draggable(true);
    } else {
      stageRef.current.draggable(false);
    }
  };

  const handleDragEnd = (e) => {
    if (isPanning || e.evt.touches?.length === 2) {
      const { x, y } = e.target.position();
      setPosition({ x, y });
    }
  };

  // Deselect when clicking empty stage
  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Canvas elements (image or text)
  const CanvasElement = ({ el, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const [image] = el.type === "image" ? useImage(el.src) : [null];

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
          width: node.width() * scaleX,
          height: node.height() * scaleY,
        });
      },
    };

    if (el.type === "image") {
      return <Image image={image} {...commonProps} />;
    } else if (el.type === "text") {
      return <Text fontSize={el.fontSize || 24} {...commonProps} />;
    }
    return null;
  };

  // Handle file drop - add new image centered in visible viewport
  const handleDrop = (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    [...files].forEach((file) => {
      if (!file.type.startsWith("image")) return;

      const reader = new FileReader();
      reader.onload = () => {
        const stage = stageRef.current;

        // Mask area center in canvas coordinates
        const canvasCenter = {
          x: config.canvasSize.width / 2,
          y: config.canvasSize.height / 2,
        };

        const scale = stage.scaleX();
        const stagePos = stage.position();

        // Convert canvas center to screen coordinates
        const screenCenter = {
          x: canvasCenter.x * scale + stagePos.x,
          y: canvasCenter.y * scale + stagePos.y,
        };

        // Convert back to canvas coordinates
        const dropX = (screenCenter.x - stagePos.x) / scale;
        const dropY = (screenCenter.y - stagePos.y) / scale;

        const imageObj = new window.Image();
        imageObj.src = reader.result;
        imageObj.onload = () => {
          const maxWidth = 150; // smaller default size
          const aspectRatio = imageObj.width / imageObj.height;
          const width = Math.min(imageObj.width, maxWidth);
          const height = width / aspectRatio;

          const newId = Date.now().toString();
          const imageElement = {
            id: newId,
            type: "image",
            src: reader.result,
            x: dropX - width / 2,
            y: dropY - height / 2,
            width,
            height,
          };

          // Add element and select it to activate transformer
          setElements((prev) => [...prev, imageElement]);
          setSelectedId(newId);
        };
      };
      reader.readAsDataURL(file);
    });
  };


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",        // full width of parent
        height: "100%",       // full height of parent
        position: "relative",
        overflow: "hidden",   // <-- prevents stage from overflowing
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onDragEnd={handleDragEnd}
        onClick={checkDeselect}
        style={{ background: "#eee", touchAction: "none" }}
        draggable={false} // default, enable only on pan
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

              mask.cutouts?.forEach((cutout) => {
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
                onChange={(newEl) =>
                  setElements((prev) => prev.map((item) => (item.id === newEl.id ? newEl : item)))
                }
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
    </div>
  );
};

export default Canvas2D;
