import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Mission3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = mount.clientWidth || 300;
      const height = mount.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 4);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      // Torus knot with metallic chrome / cobalt finish
      const geometry = new THREE.TorusKnotGeometry(1.0, 0.32, 128, 32, 2, 3);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x1e3a8a,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.3,
        roughness: 0.12,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const light1 = new THREE.DirectionalLight(0x38bdf8, 3);
      light1.position.set(5, 5, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0x818cf8, 2);
      light2.position.set(-5, -5, -2);
      scene.add(light2);

      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };
      window.addEventListener('mousemove', handleMouseMove);

      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        mesh.rotation.x = elapsed * 0.4 + mouseY * 0.4;
        mesh.rotation.y = elapsed * 0.5 + mouseX * 0.4;
        if (renderer) renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        if (renderer && renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      return;
    }
  }, []);

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />
    </div>
  );
};
