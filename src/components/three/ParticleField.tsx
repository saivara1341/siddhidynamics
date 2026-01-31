import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  mousePosition?: { x: number; y: number };
}

export const ParticleField = ({ count = 3000, mousePosition }: ParticleFieldProps) => {
  const mesh = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    // Electric orange to lime green color palette
    const colorPrimary = new THREE.Color('hsl(25, 85%, 55%)');
    const colorAccent = new THREE.Color('hsl(85, 70%, 50%)');
    const colorWarm = new THREE.Color('hsl(35, 90%, 55%)');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Create a ring-like distribution with central density
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Mix ring and sphere distribution
      const isRing = Math.random() > 0.3;
      let radius;
      
      if (isRing) {
        // Ring particles - concentrated at specific radii
        const ringRadius = 8 + Math.random() * 2;
        radius = ringRadius + (Math.random() - 0.5) * 3;
      } else {
        // Scattered particles
        radius = 3 + Math.random() * 18;
      }

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities for organic movement
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      // Color distribution
      const colorMix = Math.random();
      let color;
      if (colorMix < 0.4) {
        color = colorPrimary.clone();
      } else if (colorMix < 0.7) {
        color = colorPrimary.clone().lerp(colorWarm, Math.random());
      } else {
        color = colorWarm.clone().lerp(colorAccent, Math.random());
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    originalPositions.current = positions.slice();
    return { positions, colors, sizes, velocities };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const original = originalPositions.current!;
      
      // Organic wave motion
      const wave = Math.sin(time * 0.3 + original[i3] * 0.1) * 0.3;
      const wave2 = Math.cos(time * 0.2 + original[i3 + 1] * 0.1) * 0.2;
      
      positions[i3] = original[i3] + wave + particles.velocities[i3] * time * 10;
      positions[i3 + 1] = original[i3 + 1] + wave2 + particles.velocities[i3 + 1] * time * 10;
      positions[i3 + 2] = original[i3 + 2] + Math.sin(time * 0.4 + i * 0.01) * 0.1;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    
    // Subtle rotation
    mesh.current.rotation.y = time * 0.015;
    mesh.current.rotation.x = Math.sin(time * 0.02) * 0.08;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
