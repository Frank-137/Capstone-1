"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HistoricalEvent } from "@/lib/types";
import debounce from 'lodash/debounce';

interface GlobeProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
  selectedEvent?: HistoricalEvent | null;
  onViewportChange: (viewport: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
}

const Globe: React.FC<GlobeProps> = ({
  events,
  onSelectEvent,
  selectedEvent,
  onViewportChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const geoJsonCacheRef = useRef<any>(null);
  const viewportCacheRef = useRef<Map<string, HistoricalEvent[]>>(new Map());
  const lastViewportRef = useRef<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const eventCacheRef = useRef<Map<string, HistoricalEvent[]>>(new Map());
  const pinGroupRef = useRef<THREE.Group | null>(null);

  const cameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 2));
  const cameraRotationRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  const latLngToVector3 = (lat: number, lng: number, radius = 1.011) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (-lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Function to load and cache GeoJSON data
  const loadGeoJson = async () => {
    if (geoJsonCacheRef.current) return geoJsonCacheRef.current;
    
    try {
      const response = await fetch("/custom.geo.json");
      const data = await response.json();
      geoJsonCacheRef.current = data;
      return data;
    } catch (error) {
      console.error("Error loading GeoJSON:", error);
      return null;
    }
  };

  // Function to draw continent borders
  const drawContinentBorders = (geojson: any) => {
    if (!sceneRef.current) return;

    geojson.features.forEach((feature: any) => {
      const coordsArr =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;
      coordsArr.forEach((polygon: any) => {
        polygon.forEach((ring: any) => {
          const points: THREE.Vector3[] = ring.map(
            ([lng, lat]: [number, number]) =>
              latLngToVector3(lat, lng, 1.012)
          );
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: 0xcccccc })
          );
          sceneRef.current?.add(line);
        });
      });
    });
  };

  // Function to create a pin for an event
  const createPin = (event: HistoricalEvent, scene: THREE.Scene) => {
    const position = latLngToVector3(event.location.lat, event.location.lng);
    const isSelected = selectedEvent?.id === event.id;
    const baseColor = isSelected ? 0xffcc00 : 0xff4500;

    // Pin base
    const pinGeometry = new THREE.ConeGeometry(0.012, 0.045, 12);
    const pinMaterial = new THREE.MeshPhongMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: isSelected ? 0.7 : 0.3,
      shininess: 30,
    });

    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.copy(position);
    pin.lookAt(0, 0, 0);
    pin.rotateX(Math.PI);

    // Add halo for selected pin
    if (isSelected) {
      const haloGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.4,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      pin.add(halo);
    }

    // Pin top
    const pinTopGeometry = new THREE.SphereGeometry(0.009, 12, 12);
    const pinTopMaterial = new THREE.MeshPhongMaterial({
      color: isSelected ? 0xffffff : 0xffcc00,
      emissive: isSelected ? 0xffffff : 0xffcc00,
      emissiveIntensity: 0.5,
      shininess: 50,
    });

    const pinTop = new THREE.Mesh(pinTopGeometry, pinTopMaterial);
    pinTop.position.set(0, -0.027, 0);
    pin.add(pinTop);

    // Store metadata
    (pin as any).eventData = event;
    (pin as any).eventId = event.id;

    return pin;
  };

  // Function to update pins based on events
  const updatePins = useCallback((events: HistoricalEvent[], scene: THREE.Scene) => {
    // Remove existing pin group if it exists
    if (pinGroupRef.current) {
      scene.remove(pinGroupRef.current);
    }

    // Create new pin group
    const pinGroup = new THREE.Group();
    pinGroupRef.current = pinGroup;
    scene.add(pinGroup);

    // Create pins for each event
    events.forEach(event => {
      const pin = createPin(event, scene);
      pinGroup.add(pin);
    });
  }, [selectedEvent]);

  // Create a debounced version of onViewportChange with event caching
  const debouncedViewportChange = useCallback(
    debounce((viewport: {
      north: number;
      south: number;
      east: number;
      west: number;
    }) => {
      const viewportKey = `${viewport.north},${viewport.south},${viewport.east},${viewport.west}`;
      
      // Check if we have cached events for this viewport
      if (eventCacheRef.current.has(viewportKey)) {
        const cachedEvents = eventCacheRef.current.get(viewportKey);
        if (cachedEvents && sceneRef.current) {
          updatePins(cachedEvents, sceneRef.current);
          return;
        }
      }

      // Only trigger viewport change if it's significantly different
      if (lastViewportRef.current) {
        const threshold = 5;
        const isSignificantlyDifferent = 
          Math.abs(lastViewportRef.current.north - viewport.north) > threshold ||
          Math.abs(lastViewportRef.current.south - viewport.south) > threshold ||
          Math.abs(lastViewportRef.current.east - viewport.east) > threshold ||
          Math.abs(lastViewportRef.current.west - viewport.west) > threshold;

        if (!isSignificantlyDifferent) {
          return;
        }
      }

      lastViewportRef.current = viewport;
      onViewportChange(viewport);
    }, 500),
    [onViewportChange, updatePins]
  );

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

    camera.position.copy(cameraPositionRef.current);
    camera.rotation.copy(cameraRotationRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create Globe
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x222244,
      shininess: 5,
    });
    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Load and draw GeoJSON
    loadGeoJson().then(drawContinentBorders);

    // OrbitControls with improved smoothness
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    controls.autoRotate = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.3; 
    controls.enableZoom = true;
    controls.zoomSpeed = 0.3;
    controlsRef.current = controls;

    // Store camera position and rotation when they change
    const updateCameraPosition = () => {
      if (cameraRef.current) {
        cameraPositionRef.current.copy(cameraRef.current.position);
        cameraRotationRef.current.copy(cameraRef.current.rotation);
      }
    };
    controls.addEventListener("change", updateCameraPosition);

    const calculateViewport = () => {
      if (!cameraRef.current) return;

      const camera = cameraRef.current;
      const distance = camera.position.length();
      const fov = camera.fov;
      const aspect = camera.aspect;

      const position = camera.position;
      const vFov = (fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * distance;
      const width = height * aspect;

      const lat =
        90 -
        Math.atan2(
          position.y,
          Math.sqrt(position.x * position.x + position.z * position.z)
        ) *
          (180 / Math.PI);
      const lon = Math.atan2(position.z, position.x) * (180 / Math.PI);

      const viewport = {
        north: lat + (height / 2) * (180 / Math.PI),
        south: lat - (height / 2) * (180 / Math.PI),
        east: lon + (width / 2) * (180 / Math.PI),
        west: lon - (width / 2) * (180 / Math.PI),
      };

      viewport.north = Math.min(90, Math.max(-90, viewport.north));
      viewport.south = Math.min(90, Math.max(-90, viewport.south));
      viewport.east = ((viewport.east + 180) % 360) - 180;
      viewport.west = ((viewport.west + 180) % 360) - 180;

      debouncedViewportChange(viewport);
    };

    controls.addEventListener("change", calculateViewport);

    // Create Pin Group
    const pinGroup = new THREE.Group();
    pinGroupRef.current = pinGroup;
    scene.add(pinGroup);

    // Update pins with initial events
    updatePins(events, scene);

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
          document.body.style.cursor = "pointer";
          setHoveredPin(hovered.eventId);

          const pin = pinGroup.children.find(
            (p: any) => p.eventId === hovered.eventId
          ) as THREE.Mesh;

          if (pin && pin.scale.x < 1.3) {
            pin.scale.set(1.3, 1.3, 1.3);
          }
        }
      } else {
        document.body.style.cursor = "auto";

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

    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    const onMouseLeave = () => {
      document.body.style.cursor = "auto";
      if (hoveredPin) {
        const pin = pinGroup.children.find(
          (p: any) => p.eventId === hoveredPin
        ) as THREE.Mesh;

        if (pin) {
          pin.scale.set(0.8, 0.8, 1);
        }
        setHoveredPin(null);
      }
    };

    renderer.domElement.addEventListener("mouseleave", onMouseLeave);

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animate
    const animate = () => {
      if (
        !controlsRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      ) {
        return;
      }

      requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseleave", onMouseLeave);
      controls.removeEventListener("change", calculateViewport);
      debouncedViewportChange.cancel(); 

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (pinGroupRef.current) {
        scene.remove(pinGroupRef.current);
      }
    };
  }, [events, selectedEvent, hoveredPin, onViewportChange, debouncedViewportChange, updatePins]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-10" />
    </div>
  );
};

export default Globe;
