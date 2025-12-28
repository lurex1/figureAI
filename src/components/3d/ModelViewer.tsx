import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, Environment, useGLTF, Center } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

interface ModelViewerProps {
  className?: string;
  modelUrl?: string | null;
  autoRotate?: boolean;
}

function PlaceholderMesh() {
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

function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
    scene.position.y -= (box.min.y * scale);
  }, [scene]);

  return <primitive object={scene} />;
}

function BasePlate() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
      <meshStandardMaterial 
        color="#1a1a2e"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading 3D model...</span>
      </div>
    </div>
  );
}

export function ModelViewer({ className, modelUrl, autoRotate = true }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(!!modelUrl);

  return (
    <div className={`relative ${className}`}>
      {isLoading && <LoadingSpinner />}
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Center>
            {modelUrl ? (
              <GLBModel url={modelUrl} />
            ) : (
              <PlaceholderMesh />
            )}
          </Center>
          
          <BasePlate />
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
