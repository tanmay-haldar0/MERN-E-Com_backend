import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

function Model({ modelPath, texture }) {
  const { scene } = useGLTF(modelPath);

  React.useEffect(() => {
    console.log("Model loaded, texture:", texture);

    // Normalize scale and center model
    scene.scale.set(1, 1, 1);
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
    
    // Apply white material and texture
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.isMesh) console.log("the child is: " , child.name);
        console.log("Mesh found:", child.name, child.material);
        child.material.color = new THREE.Color('white');
        if (texture) {
          console.log(`Applying texture to mesh ${child.name}`);
          child.material.map = texture;
        }else {
          console.log(`No texture to apply on mesh ${child.name}`);
          child.material.map = null;
          child.material.needsUpdate = true;
        }
        child.material.needsUpdate = true;
        
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} />;
}

const Canvas3D = ({ modelPath, texture }) => {
  return (
    <div className="w-full h-full">
      <Canvas>
        {/* Ambient light for soft base illumination */}
        <ambientLight intensity={0.4} />

        {/* Hemisphere light to simulate environment light */}
        <hemisphereLight
          skyColor={'#ffffff'}
          groundColor={'#444444'}
          intensity={0.6}
        />

        {/* Fill in from multiple angles */}
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <directionalLight position={[0, -5, 0]} intensity={0.2} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Model modelPath={modelPath} texture={texture} />
          </Bounds>
        </Suspense>

        <OrbitControls makeDefault enableZoom enableRotate enablePan />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
