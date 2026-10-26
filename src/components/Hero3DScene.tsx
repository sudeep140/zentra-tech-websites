import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      const width = mount.clientWidth || 600;
      const height = mount.clientHeight || 560;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.4, 4.5);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      mount.appendChild(renderer.domElement);

      // Main parent group
      const mainGroup = new THREE.Group();
      mainGroup.position.set(0, 0.2, 0);
      scene.add(mainGroup);

      // Sculpture Subgroup (rotates interactively)
      const sculptureGroup = new THREE.Group();
      mainGroup.add(sculptureGroup);

      // Outer Torus: Metallic Dark Sapphire / Electric Cyan
      const outerGeo = new THREE.TorusGeometry(1.3, 0.22, 40, 120);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0x071526,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.55,
        roughness: 0.14,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
      });
      const outerRing = new THREE.Mesh(outerGeo, outerMat);
      outerRing.rotation.x = Math.PI / 3.8;
      outerRing.rotation.y = Math.PI / 5;
      sculptureGroup.add(outerRing);

      // Inner Interlocking Torus: Fiery Amber / Copper
      const innerGeo = new THREE.TorusGeometry(1.02, 0.18, 40, 120);
      const innerMat = new THREE.MeshPhysicalMaterial({
        color: 0x240d04,
        emissive: 0xff6600,
        emissiveIntensity: 0.65,
        roughness: 0.16,
        metalness: 0.98,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
      const innerRing = new THREE.Mesh(innerGeo, innerMat);
      innerRing.rotation.x = -Math.PI / 4.2;
      innerRing.rotation.y = -Math.PI / 3.6;
      sculptureGroup.add(innerRing);

      // Core Glowing Levitating Sphere
      const coreGeo = new THREE.SphereGeometry(0.32, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x020712,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.8,
      });
      const coreOrb = new THREE.Mesh(coreGeo, coreMat);
      sculptureGroup.add(coreOrb);

      // Basalt rocky pedestal platform (matching the craggy basalt rocks in the reference)
      const rockGroup = new THREE.Group();
      rockGroup.position.set(0, -1.35, 0);
      mainGroup.add(rockGroup);

      const rockGeo = new THREE.CylinderGeometry(1.6, 2.1, 0.45, 12);
      // Displace vertices to create organic rocky facets
      const pos = rockGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const noise = (Math.sin(vx * 3) + Math.cos(vz * 3)) * 0.06;
        pos.setY(i, vy + noise);
      }
      rockGeo.computeVertexNormals();

      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x090e18,
        roughness: 0.85,
        metalness: 0.35,
        flatShading: true,
      });
      const rockPedestal = new THREE.Mesh(rockGeo, rockMat);
      rockGroup.add(rockPedestal);

      // Subtle smaller rock outcroppings
      const subRockGeo = new THREE.DodecahedronGeometry(0.35, 1);
      const subRock1 = new THREE.Mesh(subRockGeo, rockMat);
      subRock1.position.set(-1.1, -1.15, 0.6);
      subRock1.rotation.set(0.4, 0.2, 0.8);
      rockGroup.add(subRock1);

      const subRock2 = new THREE.Mesh(subRockGeo, rockMat);
      subRock2.position.set(1.2, -1.2, 0.4);
      subRock2.rotation.set(0.2, 0.6, 0.3);
      rockGroup.add(subRock2);

      // Cosmic / Atmospheric Dust particles
      const particleCount = 140;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 6;
        posArray[i + 1] = (Math.random() - 0.5) * 5 + 0.2;
        posArray[i + 2] = (Math.random() - 0.5) * 4;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.038,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Dramatic Lighting
      const ambientLight = new THREE.AmbientLight(0x0a1020, 1.8);
      scene.add(ambientLight);

      // Neon Cyan Key Light
      const cyanLight = new THREE.PointLight(0x00f0ff, 10, 12);
      cyanLight.position.set(-3.5, 2.5, 2.5);
      scene.add(cyanLight);

      // Fiery Amber Accent Light
      const amberLight = new THREE.PointLight(0xff5500, 12, 12);
      amberLight.position.set(3.5, -0.5, 2.2);
      scene.add(amberLight);

      // Top Back Rim Light
      const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
      rimLight.position.set(0, 5, -3);
      scene.add(rimLight);

      // Mouse tracking
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      };

      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!mount || !renderer) return;
        const newW = mount.clientWidth;
        const newH = mount.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth mouse dampening
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Subtle gentle breathing & tilt
        sculptureGroup.rotation.y = elapsed * 0.35 + targetX * 0.45;
        sculptureGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.12 - targetY * 0.25;
        sculptureGroup.position.y = Math.sin(elapsed * 0.9) * 0.06;

        outerRing.rotation.z = elapsed * 0.12;
        innerRing.rotation.z = -elapsed * 0.16;

        const pulse = 1 + Math.sin(elapsed * 2.8) * 0.05;
        coreOrb.scale.set(pulse, pulse, pulse);

        particles.rotation.y = elapsed * 0.03;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
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
    <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[600px] flex items-center justify-center">
      {/* Background glow pools */}
      <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-cyan-500/25 blur-[120px] pointer-events-none -top-12 -left-12" />
      <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-orange-500/25 blur-[120px] pointer-events-none -bottom-10 -right-10" />

      {/* The 3D canvas mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Mountain backdrop silhouette overlay matching reference */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#05070f] via-[#05070f]/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};
