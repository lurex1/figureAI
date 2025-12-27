import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function RotatingCube({ position, size = 0.5, speed = 0.5 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="#667eea" transparent opacity={0.6} wireframe />
    </mesh>
  );
}

function RotatingSphere({ position, size = 0.4, speed = 0.6 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004 * speed;
      meshRef.current.rotation.z += 0.006 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 * speed + 1) * 0.25;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color="#764ba2" transparent opacity={0.5} wireframe />
    </mesh>
  );
}

function RotatingCone({ position, size = 0.5, speed = 0.7 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.006 * speed;
      meshRef.current.rotation.y += 0.004 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 * speed + 2) * 0.35;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[size * 0.6, size * 1.2, 8]} />
      <meshStandardMaterial color="#00d4ff" transparent opacity={0.55} wireframe />
    </mesh>
  );
}

function RotatingTorus({ position, size = 0.4, speed = 0.5 }: { position: [number, number, number]; size?: number; speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.007 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.45 * speed + 3) * 0.28;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[size, size * 0.3, 8, 16]} />
      <meshStandardMaterial color="#667eea" transparent opacity={0.5} wireframe />
    </mesh>
  );
}

export function Floating3DShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Left side shapes */}
        <RotatingCube position={[-4.5, 1.5, 0]} size={0.8} speed={0.6} />
        <RotatingSphere position={[-4, -1.5, 0.5]} size={0.6} speed={0.7} />
        
        {/* Right side shapes */}
        <RotatingCone position={[4.5, 1, 0]} size={0.7} speed={0.5} />
        <RotatingTorus position={[4, -1.8, 0.5]} size={0.55} speed={0.6} />
      </Canvas>
    </div>
  );
}
