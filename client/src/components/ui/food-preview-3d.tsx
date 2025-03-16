import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw } from 'lucide-react';

function FoodModel() {
  // Simple food representation using basic 3D shapes
  return (
    <mesh>
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

function ThreeDPreview() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FoodModel />
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={4}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Three.js Error:', error);
    this.props.onError();
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export function FoodPreview3D() {
  const [isError, setIsError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  if (isError) {
    return (
      <Card className="w-full aspect-square">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            3D preview is not available at the moment.
            <br />
            Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full aspect-square">
      <CardContent className="p-0 relative h-full">
        <ErrorBoundary onError={() => setIsError(true)}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading 3D preview...</p>
            </div>
          }>
            <ThreeDPreview />
          </Suspense>
        </ErrorBoundary>

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