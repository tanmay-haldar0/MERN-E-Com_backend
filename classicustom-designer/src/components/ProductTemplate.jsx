// src/components/ProductTemplate.jsx
import React from "react";
import { Rect, Image, Group } from "react-konva";
import useImage from "use-image";

export default function ProductTemplate({ template, stageWidth, stageHeight }) {
  const [image] = useImage(template.imageSrc);

  const clipProps = template.clipPath(stageWidth, stageHeight);

  return (
    <Group clipFunc={(ctx) => {
      // Rounded rect clip area
      ctx.beginPath();
      ctx.moveTo(clipProps.x + clipProps.cornerRadius, clipProps.y);
      ctx.lineTo(clipProps.x + clipProps.width - clipProps.cornerRadius, clipProps.y);
      ctx.quadraticCurveTo(
        clipProps.x + clipProps.width,
        clipProps.y,
        clipProps.x + clipProps.width,
        clipProps.y + clipProps.cornerRadius
      );
      ctx.lineTo(clipProps.x + clipProps.width, clipProps.y + clipProps.height - clipProps.cornerRadius);
      ctx.quadraticCurveTo(
        clipProps.x + clipProps.width,
        clipProps.y + clipProps.height,
        clipProps.x + clipProps.width - clipProps.cornerRadius,
        clipProps.y + clipProps.height
      );
      ctx.lineTo(clipProps.x + clipProps.cornerRadius, clipProps.y + clipProps.height);
      ctx.quadraticCurveTo(
        clipProps.x,
        clipProps.y + clipProps.height,
        clipProps.x,
        clipProps.y + clipProps.height - clipProps.cornerRadius
      );
      ctx.lineTo(clipProps.x, clipProps.y + clipProps.cornerRadius);
      ctx.quadraticCurveTo(clipProps.x, clipProps.y, clipProps.x + clipProps.cornerRadius, clipProps.y);
      ctx.closePath();
    }}>
      {/* Draw base image */}
      {image && <Image image={image} x={0} y={0} width={stageWidth} height={stageHeight} />}
      {/* Optionally, show the clip area border */}
      <Rect
        x={clipProps.x}
        y={clipProps.y}
        width={clipProps.width}
        height={clipProps.height}
        cornerRadius={clipProps.cornerRadius}
        stroke="gray"
        strokeWidth={1}
      />
    </Group>
  );
}
