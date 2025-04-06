/*import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { Mask, useMask, Float, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { ARButton, XR, Interactive } from "@react-three/xr";
import WebXRPolyfill from "webxr-polyfill";

export function App() {
  const [invert, setInvert] = useState(false);
  const [colorWrite, setColorWrite] = useState(true);
  const [xrSupported, setXrSupported] = useState(true);

  useEffect(() => {
    // Apply WebXR Polyfill for iOS
    new WebXRPolyfill();

    if (!navigator.xr) {
      setXrSupported(false);
    }
  }, []);

  const onSelect = () => {
    setInvert(!invert);
    setColorWrite(!colorWrite);
  };

  return (
    <>
      {!xrSupported && <div style={{ color: "red", textAlign: "center" }}>WebXR is not supported on this device</div>}
      
      <ARButton />
      <Canvas camera={{ position: [0, 0, 5] }}>
        <XR>
          <hemisphereLight intensity={1} groundColor="red" />
          <Suspense fallback={null}>
            <Interactive onSelect={onSelect}>
              <Float floatIntensity={3} rotationIntensity={1} speed={5} position={[0, 1, -2]}>
                <Mask id={1} colorWrite={colorWrite} depthWrite={false}>
                  {(spread) => (
                    <>
                      <planeGeometry args={[1, 1, 128, 128]} />
                      <MeshDistortMaterial distort={0.5} radius={1} speed={10} {...spread} />
                    </>
                  )}
                </Mask>
              </Float>
            </Interactive>
            <MaskedContent invert={invert} />
            <OrbitControls makeDefault />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}

function MaskedContent({ invert }) {
  const stencil = useMask(1, invert);

  const texture = useLoader(THREE.TextureLoader, "my-ar-portal/public/fantasy_lands_a_bright_city_during_the_day_with_cl.jpg");
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} {...stencil} />
    </mesh>
  );
}
*/

import { Suspense, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Mask,
  useMask,
  Float,
  OrbitControls,
  MeshDistortMaterial,
  Text,
} from "@react-three/drei";
import { XR, Interactive, useXR } from "@react-three/xr";

// Images for each portal
const images = ["cyberpunk_a_dark_city_during_the_night_with_neon_l.jpg", "fantasy_lands_a_bright_city_during_the_day_with_cl.jpg", "technical_drawing_a_bright_city_during_the_day_wit.jpg"];

function MaskedContent({ invert, image, maskId }) {
  const stencil = useMask(maskId, invert);
  const texture = useLoader(THREE.TextureLoader, image);
  return (
    <mesh>
      <sphereBufferGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        {...stencil}
      />
    </mesh>
  );
}

function Portal({
  position,
  image,
  maskId,
  isVisible,
  isActive,
  onSelectPortal,
}) {
  const [invert, setInvert] = useState(false);
  const [colorWrite, setColorWrite] = useState(true);
  const depthWrite = false;

  const onSelect = () => {
    setInvert(true);
    setColorWrite(false);
    onSelectPortal(maskId);
  };

  if (!isVisible) return null;

  return (
    <Interactive onSelect={onSelect}>
      <Float floatIntensity={3} rotationIntensity={1} speed={5} position={position}>
        <Mask id={maskId} colorWrite={colorWrite} depthWrite={depthWrite}>
          {(spread) => (
            <>
              <planeGeometry args={[1, 3, 128, 128]} />
              <MeshDistortMaterial
                color={isActive ? "aqua" : "white"}
                emissive={isActive ? "aqua" : "black"}
                emissiveIntensity={0.4}
                distort={0.5}
                speed={10}
                {...spread}
              />
            </>
          )}
        </Mask>
        {isActive && (
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color="aqua"
            anchorX="center"
            anchorY="middle"
          >
            Entered!
          </Text>
        )}
      </Float>
      <MaskedContent invert={invert} image={image} maskId={maskId} />
    </Interactive>
  );
}

export function App() {
  const [selectedPortal, setSelectedPortal] = useState(null);

  const handleSelect = (id) => {
    setSelectedPortal(id);
  };

  const resetView = () => {
    setSelectedPortal(null);
  };

  return (
    <>
      <button
        onClick={resetView}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "10px 20px",
          borderRadius: "10px",
          background: "black",
          color: "white",
          zIndex: 10,
          display: selectedPortal ? "block" : "none",
        }}
      >
        Back
      </button>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <XR>
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Portal
              position={[-3, 1, -2]}
              image={images[0]}
              maskId={1}
              isVisible={!selectedPortal || selectedPortal === 1}
              isActive={selectedPortal === 1}
              onSelectPortal={handleSelect}
            />
            <Portal
              position={[0, 1, -2]}
              image={images[1]}
              maskId={2}
              isVisible={!selectedPortal || selectedPortal === 2}
              isActive={selectedPortal === 2}
              onSelectPortal={handleSelect}
            />
            <Portal
              position={[3, 1, -2]}
              image={images[2]}
              maskId={3}
              isVisible={!selectedPortal || selectedPortal === 3}
              isActive={selectedPortal === 3}
              onSelectPortal={handleSelect}
            />
            <OrbitControls makeDefault />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}
