// src/components/ObjectTransformer.jsx
import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { useCanvasStore } from "../context/CanvasContext";

export default function ObjectTransformer({ selectedId }) {
  const transformerRef = useRef();
  const { objects } = useCanvasStore();

  useEffect(() => {
    const stage = transformerRef.current?.getStage();
    if (!stage) return;

    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode && transformerRef.current) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, objects]);

  return <Transformer ref={transformerRef} />;
}
