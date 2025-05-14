'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HistoricalEvent } from '@/lib/types';

interface GlobeProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
  selectedEvent?: HistoricalEvent | null;
}

const Globe: React.FC<GlobeProps> = ({ events, onSelectEvent, selectedEvent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Helper: Convert lat/lng to 3D coordinates
  const latLngToVector3 = (lat: number, lng: number, radius = 1.01) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/textures/earth.jpg');
    const bumpMap = textureLoader.load('/textures/earth-bump.jpg');
    const specularMap = textureLoader.load('/textures/earth-specular.jpg');

    // Create Globe
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color('grey'),
      shininess: 5
    });
    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // Create Pin Group
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    
    // Create Pins
    events.forEach(event => {
      const position = latLngToVector3(event.location.lat, event.location.lng);
      
      // Pin base (cone with wider base and taller height)
      const pinGeometry = new THREE.ConeGeometry(0.015, 0.06, 12);
      
      // Determine pin color based on selected state
      const isSelected = selectedEvent?.id === event.id;
      const baseColor = isSelected ? 0xffcc00 : 0xff4500; // Orange-red for normal, gold for selected
      
      // Create pin material with emissive properties
      const pinMaterial = new THREE.MeshPhongMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: isSelected ? 0.7 : 0.3,
        shininess: 30
      });
      
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.copy(position);
      pin.lookAt(0, 0, 0);
      pin.rotateX(Math.PI); // Rotate so tip points outward
      
      // Add glowing halo effect for selected pin
      if (isSelected) {
        const haloGeometry = new THREE.SphereGeometry(0.025, 16, 16);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.4
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        pin.add(halo);
      }
      
      // Create small sphere on top of pin
      const pinTopGeometry = new THREE.SphereGeometry(0.012, 12, 12);
      const pinTopMaterial = new THREE.MeshPhongMaterial({
        color: isSelected ? 0xffffff : 0xffcc00,
        emissive: isSelected ? 0xffffff : 0xffcc00,
        emissiveIntensity: 0.5,
        shininess: 50
      });
      
      const pinTop = new THREE.Mesh(pinTopGeometry, pinTopMaterial);
      pinTop.position.set(0, -0.035, 0); // Position on top of pin
      pin.add(pinTop);

      // Store metadata
      (pin as any).eventData = event;
      (pin as any).eventId = event.id;

      pinGroup.add(pin);
    });

    // Add raycaster for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      if (!renderer || !cameraRef.current) return;

      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(pinGroup.children);
      if (intersects.length > 0) {
        const selected = intersects[0].object as any;
        if (selected.eventData) {
          onSelectEvent(selected.eventData);
        }
      }
    };

    // Add mouse move for hover effect
    const onMouseMove = (event: MouseEvent) => {
      if (!renderer || !cameraRef.current) return;

      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(pinGroup.children);
      
      if (intersects.length > 0) {
        const hovered = intersects[0].object as any;
        if (hovered.eventId) {
          document.body.style.cursor = 'pointer';
          setHoveredPin(hovered.eventId);
          
          // Scale up the hovered pin
          const pin = pinGroup.children.find(
            (p: any) => p.eventId === hovered.eventId
          ) as THREE.Mesh;
          
          if (pin && pin.scale.x < 1.3) {
            pin.scale.set(1.3, 1.3, 1.3);
          }
        }
      } else {
        document.body.style.cursor = 'auto';
        
        // Reset any previously hovered pin
        if (hoveredPin) {
          const pin = pinGroup.children.find(
            (p: any) => p.eventId === hoveredPin
          ) as THREE.Mesh;
          
          if (pin) {
            pin.scale.set(1, 1, 1);
          }
          setHoveredPin(null);
        }
      }
    };

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Reset cursor when mouse leaves the canvas
    const onMouseLeave = () => {
      document.body.style.cursor = 'auto';
      // Reset any hovered pin
      if (hoveredPin) {
        const pin = pinGroup.children.find(
          (p: any) => p.eventId === hoveredPin
        ) as THREE.Mesh;
        
        if (pin) {
          pin.scale.set(1, 1, 1);
        }
        setHoveredPin(null);
      }
    };
    
    renderer.domElement.addEventListener('mouseleave', onMouseLeave);

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [events, selectedEvent, hoveredPin]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-10" />
    </div>
  );
};

export default Globe;