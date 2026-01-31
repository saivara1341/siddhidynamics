import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  distort?: number;
  type?: 'icosahedron' | 'torus' | 'sphere';
}

const FloatingShape = ({ 
  position, 
  scale = 1, 
  color = '#dd8448', 
  speed = 1,
  distort = 0.2,
  type = 'icosahedron'
}: FloatingShapeProps) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
  });

  const renderGeometry = () => {
    switch (type) {
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      default:
        return <icosahedronGeometry args={[1, 1]} />;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} scale={scale}>
        {renderGeometry()}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.5}
          distort={distort}
          speed={1.5}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
};

// Glowing ring component
const GlowingRing = ({ 
  position, 
  scale = 1, 
  color = '#dd8448',
  rotationSpeed = 0.1
}: { 
  position: [number, number, number]; 
  scale?: number; 
  color?: string;
  rotationSpeed?: number;
}) => {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    ring.current.rotation.z = state.clock.elapsedTime * rotationSpeed;
  });

  return (
    <mesh ref={ring} position={position} scale={scale}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};

// Orbital particle
const OrbitalParticle = ({
  radius = 3,
  speed = 1,
  offset = 0,
  color = '#dd8448'
}: {
  radius?: number;
  speed?: number;
  offset?: number;
  color?: string;
}) => {
  const particle = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!particle.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    particle.current.position.x = Math.cos(t) * radius;
    particle.current.position.z = Math.sin(t) * radius;
    particle.current.position.y = Math.sin(t * 2) * 0.5;
  });

  return (
    <mesh ref={particle}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export const FloatingGeometry = () => {
  return (
    <group>
      {/* Main floating shapes */}
      <FloatingShape 
        position={[-5, 2, -4]} 
        scale={0.7} 
        color="#dd8448" 
        speed={0.4}
        distort={0.25}
      />
      <FloatingShape 
        position={[5, -1, -6]} 
        scale={1} 
        color="#9acd32" 
        speed={0.3}
        type="torus"
      />
      <FloatingShape 
        position={[3, 3, -5]} 
        scale={0.5} 
        color="#dd8448" 
        speed={0.6}
      />
      <FloatingShape 
        position={[-4, -2, -7]} 
        scale={0.8} 
        color="#b8860b" 
        speed={0.35}
        type="sphere"
      />
      <FloatingShape 
        position={[0, -3, -9]} 
        scale={1.2} 
        color="#9acd32" 
        speed={0.2}
        distort={0.3}
      />

      {/* Glowing rings - moved to corners */}
      <GlowingRing position={[-6, 3, -8]} scale={0.8} color="#dd8448" rotationSpeed={0.1} />
      <GlowingRing position={[6, -2, -10]} scale={1} color="#9acd32" rotationSpeed={-0.08} />

      {/* Orbital particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <OrbitalParticle
          key={i}
          radius={3 + Math.random() * 2}
          speed={0.3 + Math.random() * 0.2}
          offset={(i / 8) * Math.PI * 2}
          color={i % 2 === 0 ? '#dd8448' : '#9acd32'}
        />
      ))}
    </group>
  );
};
