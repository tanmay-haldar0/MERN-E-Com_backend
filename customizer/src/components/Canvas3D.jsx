import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

const Canvas3D = ({ modelPath }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <Model modelPath={modelPath} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
