import React from 'react';
import { useTemplate } from './useTemplate';
import Canvas2D from '../components/Canvas2D';
import Canvas3D from '../components/Canvas3D';
import { useCanvasStore } from '../hooks/useCanvasStore';

export default function TemplateLoader({ templateName }) {
  const { config, modelPath } = useTemplate(templateName);
  const mode = useCanvasStore(state => state.mode);

  return (
    <div className="w-full h-full overflow-auto">
      {mode === '2D' ? (
        <Canvas2D config={config} />
      ) : (
        <Canvas3D modelPath={modelPath} />
      )}
    </div>
  );
}
