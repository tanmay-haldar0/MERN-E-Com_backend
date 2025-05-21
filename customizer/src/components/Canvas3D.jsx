import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ modelPath, texture }) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useEffect(() => {
    // Scale model bigger
    scene.scale.set(15, 15, 10);

    // Traverse to update material to white and apply texture if given
    scene.traverse((child) => {
      if (child.isMesh) {
        // Set color white
        if (child.material) {
          child.material.color = new THREE.Color('white');
          child.material.needsUpdate = true;

          // If texture provided, set it on the material map
          if (texture) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, texture]);

  return <primitive ref={ref} object={scene} />;
}

const Canvas3D = ({ modelPath, texture }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <Model modelPath={modelPath} texture={texture} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
