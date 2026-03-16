import { TransformControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore, type KeyframeData } from '../../store/editorStore';
import { useMemo, useState, useRef } from 'react';

interface KeyframeObjectProps {
  data: KeyframeData;
  isGhost?: boolean;
}

function ModelRenderer({ url, isGhost = false, color }: { url: string; isGhost?: boolean; color?: string }) {
  const { scene } = useGLTF(url);
  // Clone the scene so multiple instances of the same model can be used independently
  const clonedScene = useMemo(() => {
    const s = scene.clone();
    s.traverse((node: any) => {
      if (node.isMesh && node.material) {
        node.material = node.material.clone();
        if (isGhost) {
          node.material.transparent = true;
          node.material.opacity = 0.3;
          node.material.depthWrite = false;
        }
        // Apply color if provided
        if (color && !isGhost) {
          node.material.color.set(color);
        }
      }
    });
    return s;
  }, [scene, isGhost, color]);
  return <primitive object={clonedScene} />;
}

export function KeyframeObject({ data, isGhost = false }: KeyframeObjectProps) {
  const [mesh, setMesh] = useState<THREE.Mesh | null>(null);
  const transformRef = useRef<any>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const subPartRef = useRef<THREE.Object3D | null>(null);

  // We need unique geometries per object so sculpting one box doesn't sculpt another box
  const geometry = useMemo(() => {
    switch(data.type) {
      case 'sphere': return new THREE.SphereGeometry(0.5, 32, 32);
      case 'sun': return new THREE.SphereGeometry(0.8, 32, 32);
      case 'cylinder': return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      case 'cone': return new THREE.ConeGeometry(0.5, 1, 32);
      case 'torus': return new THREE.TorusGeometry(0.5, 0.2, 16, 100);
      case 'plane': return new THREE.PlaneGeometry(1, 1);
      case 'icosahedron': return new THREE.IcosahedronGeometry(0.5, 0);
      case 'capsule': return new THREE.CapsuleGeometry(0.3, 0.5, 4, 16);
      case 'human': {
        const group = new THREE.Group();
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial());
        head.position.y = 0.85; head.name = 'head';
        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.6, 16), new THREE.MeshStandardMaterial());
        body.position.y = 0.45; body.name = 'body';
        // Legs
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), new THREE.MeshStandardMaterial());
        leg1.position.set(-0.1, 0.15, 0); leg1.name = 'leg_L';
        const leg2 = leg1.clone();
        leg2.position.set(0.1, 0.15, 0); leg2.name = 'leg_R';
        // Arms
        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), new THREE.MeshStandardMaterial());
        arm1.position.set(-0.25, 0.55, 0); arm1.name = 'arm_L';
        const arm2 = arm1.clone();
        arm2.position.set(0.25, 0.55, 0); arm2.name = 'arm_R';
        
        const g = group.add(head, body, leg1, leg2, arm1, arm2);
        
        // Apply saved sub-transforms
        if (data.subTransforms) {
          g.children.forEach(child => {
            const st = data.subTransforms![child.name];
            if (st) {
              child.position.set(...st.position);
              child.rotation.set(...st.rotation);
              child.scale.set(...st.scale);
            }
          });
        }
        return g as any;
      }
      case 'car': {
        const carGroup = new THREE.Group();
        // Chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.4), new THREE.MeshStandardMaterial());
        chassis.position.y = 0.15; chassis.name = 'chassis';
        // Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.35), new THREE.MeshStandardMaterial());
        top.position.y = 0.4; top.name = 'top';
        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const wheelMat = new THREE.MeshStandardMaterial({ color: '#333' });
        const wheel1 = new THREE.Mesh(wheelGeom, wheelMat);
        wheel1.rotation.z = Math.PI / 2;
        wheel1.position.set(-0.25, 0.1, 0.2); wheel1.name = 'wheel_FL';
        const wheel2 = wheel1.clone(); wheel2.position.set(0.25, 0.1, 0.2); wheel2.name = 'wheel_FR';
        const wheel3 = wheel1.clone(); wheel3.position.set(-0.25, 0.1, -0.2); wheel3.name = 'wheel_RL';
        const wheel4 = wheel1.clone(); wheel4.position.set(0.25, 0.1, -0.2); wheel4.name = 'wheel_RR';
        
        const cg = carGroup.add(chassis, top, wheel1, wheel2, wheel3, wheel4);

        // Apply saved sub-transforms
        if (data.subTransforms) {
          cg.children.forEach(child => {
            const st = data.subTransforms![child.name];
            if (st) {
              child.position.set(...st.position);
              child.rotation.set(...st.rotation);
              child.scale.set(...st.scale);
            }
          });
        }
        return cg as any;
      }
      case 'cube':
      case 'default':
      default:
        return new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); // higher poly for displacement
    }
  }, [data.type, data.subTransforms]);

  const selectedId = useEditorStore((state) => state.selectedId);
  const transformMode = useEditorStore((state) => state.transformMode);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const updateKeyframe = useEditorStore((state) => state.updateKeyframe);

  const isSelected = selectedId === data.id && !isGhost;

  const handleClick = (e: any) => {
    if (isGhost) return;
    e.stopPropagation();
    
    if (transformMode === 'subTransform') {
      // Find the clicked child part
      const meshPart = e.object as THREE.Object3D;
      if (meshPart && meshPart.name && meshPart.name !== '') {
        setSelectedPartName(meshPart.name);
        subPartRef.current = meshPart;
      }
    } else {
      setSelectedId(data.id);
      setSelectedPartName(null);
    }
  };

  // Sync back to store when transform control stops dragging
  const handleTransformMouseUp = () => {
    if (transformMode === 'subTransform' && selectedPartName && subPartRef.current) {
        const part = subPartRef.current;
        updateKeyframe(data.id, {
            subTransforms: {
                ...(data.subTransforms || {}),
                [selectedPartName]: {
                    position: [part.position.x, part.position.y, part.position.z],
                    rotation: [part.rotation.x, part.rotation.y, part.rotation.z],
                    scale: [part.scale.x, part.scale.y, part.scale.z],
                }
            }
        });
        return;
    }

    if (mesh) {
      updateKeyframe(data.id, {
        position: [
          mesh.position.x,
          mesh.position.y,
          mesh.position.z,
        ],
        rotation: [
          mesh.rotation.x,
          mesh.rotation.y,
          mesh.rotation.z,
        ],
        scale: [
          mesh.scale.x,
          mesh.scale.y,
          mesh.scale.z,
        ],
      });
    }
  };

  const handlePointerDown = (e: any) => {
    if (isGhost) return;
    if (transformMode === 'sculpt' && isSelected) {
      e.stopPropagation();
      setIsPointerDown(true);
    }
  };

  const handlePointerUp = () => {
    if (isGhost) return;
    setIsPointerDown(false);
  };

  const handlePointerMove = (e: any) => {
    if (isGhost) return;
    if (transformMode === 'sculpt' && isSelected && isPointerDown && mesh && e.intersections.length > 0) {
      e.stopPropagation();
      
      const intersect = e.intersections.find((i: any) => i.object === mesh);
      if (!intersect) return;

      const geom = mesh.geometry as THREE.BufferGeometry;
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
        const worldV = v.clone().applyMatrix4(mesh.matrixWorld);

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
      color={isSelected ? '#6366f1' : (isGhost ? '#cbd5e1' : (data.color || '#a5b4fc'))} 
      roughness={0.2}
      metalness={0.1}
      emissive={data.type === 'sun' ? new THREE.Color(data.color || '#fcd34d').multiplyScalar(1.5) : (isSelected ? new THREE.Color('#6366f1').multiplyScalar(0.2) : '#ffffff')}
      emissiveIntensity={data.type === 'sun' ? 2 : 1}
      transparent={isGhost}
      opacity={isGhost ? 0.3 : 1}
      depthWrite={!isGhost}
    />
  );

  const content = (
    <mesh
      ref={setMesh}
      position={data.position}
      rotation={data.rotation as any}
      scale={data.scale}
      geometry={(data.type !== 'model' && data.type !== 'human' && data.type !== 'car') ? geometry as THREE.BufferGeometry : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
      castShadow
      receiveShadow
    >
      {data.type === 'model' && data.url ? (
        <ModelRenderer url={data.url} isGhost={isGhost} color={data.color} />
      ) : (data.type === 'human' || data.type === 'car') ? (
        <primitive object={geometry}>
          {material}
        </primitive>
      ) : (
        <>
          {material}
          {data.type === 'sun' && !isGhost && (
            <pointLight 
              intensity={2} 
              distance={10} 
              color={data.color || '#fcd34d'} 
              castShadow 
            />
          )}
        </>
      )}
    </mesh>
  );

  return (
    <group>
      {content}
      {isSelected && transformMode !== 'sculpt' && transformMode !== 'subTransform' && mesh && (
        <TransformControls
          ref={transformRef}
          object={mesh}
          mode={transformMode as any}
          onMouseUp={handleTransformMouseUp}
        />
      )}
      {isSelected && transformMode === 'subTransform' && selectedPartName && subPartRef.current && (
        <TransformControls
          ref={transformRef}
          object={subPartRef.current as any}
          mode="translate"
          onMouseUp={handleTransformMouseUp}
        />
      )}
    </group>
  );
}
