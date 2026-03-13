import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Stage } from '@react-three/drei';
import { useEditorStore } from '../../store/editorStore';
import { KeyframeObject } from './KeyframeObject';
import { Suspense, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three-stdlib';

interface EditorCanvasProps {
  sunPosition: [number, number, number];
  sunIntensity: number;
  sunColor: string;
}

function ExportHandler() {
  const { scene } = useThree();
  useEffect(() => {
    const handleExport = () => {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'temporal-scene.gltf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('An error happened during export:', error);
        },
        // We only want to export the models and primitives, ignore grid/lights/helpers if possible.
        // For simplicity, we export the whole scene. 
        { binary: false } 
      );
    };

    window.addEventListener('export-scene', handleExport);
    return () => window.removeEventListener('export-scene', handleExport);
  }, [scene]);

  return null;
}

export function EditorCanvas({ sunPosition, sunIntensity, sunColor }: EditorCanvasProps) {
  const keyframes = useEditorStore((state) => state.keyframes);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);

  const handlePointerMissed = (e: MouseEvent) => {
    // If clicking outside any object, deselect
    if (e.type === 'click') {
      setSelectedId(null);
    }
  };

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 45 }}
      onPointerMissed={handlePointerMissed}
      className="w-full h-full bg-neutral-50"
    >
      <color attach="background" args={['#fafafa']} />
      <fog attach="fog" args={['#fafafa', 10, 40]} />

      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <Suspense fallback={null}>
        <ExportHandler />
        <Stage adjustCamera={false} intensity={0.5} environment="city">
          {keyframes.map((kf) => (
            <KeyframeObject key={kf.id} data={kf} />
          ))}
        </Stage>

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.8}
          scale={20}
          blur={2}
          far={4}
          color="#000000"
        />

        <Grid
          infiniteGrid
          fadeDistance={30}
          fadeStrength={1}
          sectionColor="#cbd5e1" // Tailwind slate-300
          cellColor="#e2e8f0"    // Tailwind slate-200
        />

      </Suspense>

      {/* OrbitControls mapped to Right and Middle click typically */}
      <OrbitControls
        makeDefault
        mouseButtons={{
          LEFT: undefined, // Left click is used for selection/transform
          MIDDLE: 2,       // THREE.MOUSE.DOLLY
          RIGHT: 0,        // THREE.MOUSE.ROTATE (0 is LEFT internally in OrbitControls, mapped here as a config if needed) 
                           // Wait, OrbitControls defaults: LEFT=Rotate, MIDDLE=Dolly, RIGHT=Pan. 
                           // We need: Right -> Orbit(Rotate), Middle -> Pan/Dolly. Left -> None.
        }}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
