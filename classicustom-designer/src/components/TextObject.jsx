import React, { useRef } from "react";
import { Text } from "react-konva";

export default function TextObject({ shapeProps, isSelected, onSelect, onChange }) {
  const textRef = useRef();

  return (
    <Text
      {...shapeProps}
      id={shapeProps.id}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      ref={textRef}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();

        node.scaleX(1);
        node.scaleY(1);

        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          fontSize: Math.max(10, node.fontSize() * scaleX),
        });
      }}
    />
  );
}
