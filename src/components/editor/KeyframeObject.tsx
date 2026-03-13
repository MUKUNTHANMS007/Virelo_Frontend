import { TransformControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore, type KeyframeData } from '../../store/editorStore';
import { useMemo, useState, useRef } from 'react';

interface KeyframeObjectProps {
  data: KeyframeData;
}

function ModelRenderer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Clone the scene so multiple instances of the same model can be used independently
  const clonedScene = scene.clone();
  return <primitive object={clonedScene} />;
}

export function KeyframeObject({ data }: KeyframeObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<any>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);

  // We need unique geometries per object so sculpting one box doesn't sculpt another box
  const geometry = useMemo(() => {
    switch(data.type) {
      case 'sphere': return new THREE.SphereGeometry(0.5, 32, 32);
      case 'cylinder': return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      case 'cube':
      case 'default':
      default:
        return new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); // higher poly for displacement
    }
  }, [data.type]);

  const selectedId = useEditorStore((state) => state.selectedId);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const updateKeyframe = useEditorStore((state) => state.updateKeyframe);

  const isSelected = selectedId === data.id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedId(data.id);
  };

  // Sync back to store when transform control stops dragging
  const handleTransformMouseUp = () => {
    if (meshRef.current) {
      updateKeyframe(data.id, {
        position: [
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z,
        ],
        rotation: [
          meshRef.current.rotation.x,
          meshRef.current.rotation.y,
          meshRef.current.rotation.z,
        ],
        scale: [
          meshRef.current.scale.x,
          meshRef.current.scale.y,
          meshRef.current.scale.z,
        ],
      });
    }
  };

  const handlePointerDown = (e: any) => {
    if (transformMode === 'sculpt' && isSelected) {
      e.stopPropagation();
      setIsPointerDown(true);
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  const handlePointerMove = (e: any) => {
    if (transformMode === 'sculpt' && isSelected && isPointerDown && meshRef.current && e.intersections.length > 0) {
      e.stopPropagation();
      
      const intersect = e.intersections.find((i: any) => i.object === meshRef.current);
      if (!intersect) return;

      const geom = meshRef.current.geometry as THREE.BufferGeometry;
      const positionAttr = geom.attributes.position;
      const normalAttr = geom.attributes.normal;
      
      const v = new THREE.Vector3();
      const n = new THREE.Vector3();
      
      // Pull vertices near the ray intersection point outwards
      const radius = 0.5;
      const strength = 0.05;

      for (let i = 0; i < positionAttr.count; i++) {
        v.fromBufferAttribute(positionAttr, i);
        // Convert local vertex to world to compare with the world intersection point
        const worldV = v.clone().applyMatrix4(meshRef.current.matrixWorld);

        const dist = worldV.distanceTo(intersect.point);
        if (dist < radius) {
          // Push vertex along its normal
          n.fromBufferAttribute(normalAttr, i);
          const falloff = 1 - (dist / radius);
          v.addScaledVector(n, strength * falloff);
          positionAttr.setXYZ(i, v.x, v.y, v.z);
        }
      }
      
      positionAttr.needsUpdate = true;
      geom.computeVertexNormals();
    }
  };

  // The actual 3D representation
  const material = (
    <meshStandardMaterial 
      color={isSelected ? '#6366f1' : '#a5b4fc'} 
      roughness={0.2}
      metalness={0.1}
      emissive={isSelected ? new THREE.Color('#6366f1').multiplyScalar(0.2) : '#ffffff'}
    />
  );

  const content = (
    <mesh
      ref={meshRef}
      position={data.position}
      rotation={data.rotation as any}
      scale={data.scale}
      geometry={(data.type !== 'model') ? geometry : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
      castShadow
      receiveShadow
    >
      {data.type === 'model' && data.url ? (
        <ModelRenderer url={data.url} />
      ) : (
        material
      )}
    </mesh>
  );

  if (isSelected) {
    // TransformControls only supports translate, rotate, scale. 
    // In sculpt mode, we hide the transform gizmo.
    if (transformMode === 'sculpt') {
      return content;
    }

    return (
      <TransformControls
        ref={transformRef}
        object={meshRef.current || undefined}
        mode={transformMode}
        onMouseUp={handleTransformMouseUp}
      >
        {content}
      </TransformControls>
    );
  }

  return content;
}
