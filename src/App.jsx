import { Suspense, useState, useEffect } from "react";
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
