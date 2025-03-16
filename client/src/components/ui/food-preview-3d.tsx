import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw } from 'lucide-react';

function FoodModel({ rotation = [0, 0, 0] }) {
  // Simple food representation using basic 3D shapes
  return (
    <mesh rotation={rotation}>
      {/* Base/plate */}
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshStandardMaterial color="#e2e2e2" />

      {/* Food item (example: burger) */}
      <group position={[0, 0.6, 0]}>
        {/* Bottom bun */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1.1, 0.3, 32]} />
          <meshStandardMaterial color="#d4a054" />
        </mesh>

        {/* Patty */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>

        {/* Top bun */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1.1, 1, 0.4, 32]} />
          <meshStandardMaterial color="#d4a054" />
        </mesh>
      </group>
    </mesh>
  );
}

export function FoodPreview3D() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Card className="w-full aspect-square">
      <CardContent className="p-0 relative h-full">
        <Canvas>
          <Stage environment="city" intensity={0.5}>
            <FoodModel />
          </Stage>
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={4}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <PerspectiveCamera position={[0, 2, 8]} />
        </Canvas>

        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          <RotateCw className="h-4 w-4" />
          <span className="sr-only">Toggle rotation</span>
        </Button>
      </CardContent>
    </Card>
  );
}