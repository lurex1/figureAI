import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Environment } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

interface ModelViewerProps {
  className?: string;
}

function RotatingMesh() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <capsuleGeometry args={[0.5, 1, 16, 32]} />
      <meshStandardMaterial 
        color="#00d4ff"
        metalness={0.3}
        roughness={0.4}
        emissive="#00d4ff"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function BasePlate() {
  return (
    <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
      <meshStandardMaterial 
        color="#1a1a2e"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export function ModelViewer({ className }: ModelViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <RotatingMesh />
          <BasePlate />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
            minDistance={2}
            maxDistance={8}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
