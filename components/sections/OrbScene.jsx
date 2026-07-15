"use client";

// =============================================================================
// TEST HERO — interactive chrome orb (R3F scene)
// Rendered only on desktop and only after OrbHero decides to mount it, via a
// dynamic() import with { ssr: false }. This keeps three.js out of the SSR and
// mobile bundles entirely (mobile falls back to the original <Hero />).
// =============================================================================

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// -- tunables (adjust by feel) -----------------------------------------------
// Mirror polish: 0 = perfect chrome mirror. Nudge up toward ~0.15 for a
// softer, brushed/satin reflection.
const ROUGHNESS = 0;
// Auto-rotation about Y, in radians per second. Slow + ambient, not a viewer.
const ROTATION_SPEED = 0.12;

// Framing — orb is centred; tweak these after first render to match the ref.
const CAMERA = { position: [0, 0, 5], fov: 35 };
const ORB_POSITION = [0, 0, 0];
const ORB_SCALE = 1; // sphere radius is 1; scale the whole orb up/down here

// The mountain scene the orb reflects — the SAME image the CSS background uses.
// A regular (non-HDR) landscape photo used as an equirectangular env map:
// front-facing reflection reads as the mountains; pole smearing is expected.
const BACKGROUND_SRC = "/images/hero/hero-bg.jpg";

// The orb reflects this by way of scene.environment (drei <Environment map>).
function Reflections() {
  // We load the photo ourselves as a plain equirectangular texture rather than
  // using <Environment files="…jpg">. drei routes .jpg env files through a
  // gainmap HDR loader (@monogrid/gainmap-js) that only accepts gainmap-encoded
  // JPEGs — a normal photograph stalls it and the whole canvas renders nothing.
  // Handing the texture to <Environment map> sets scene.environment directly.
  const texture = useLoader(THREE.TextureLoader, BACKGROUND_SRC);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return <Environment map={texture} background={false} />;
}

function Orb({ dragState, reducedMotion }) {
  const meshRef = useRef(null);
  const scene = useThree((state) => state.scene);

  useFrame((_, delta) => {
    // A perfect mirror sphere is rotationally invariant: spinning the geometry
    // changes nothing on screen, because its set of surface normals is identical
    // at any orientation. So "rotating the orb" has to mean rotating the scene it
    // reflects — we turn scene.environmentRotation.y, which sweeps the mountains
    // (and the equirect pole smear) around the chrome. The mesh itself stays put.
    //
    // NOTE: if you later add surface detail (a normal/roughness map for a brushed
    // finish), spin `meshRef.current.rotation.y` instead — that motion WOULD read.
    if (dragState.current.active) {
      // Drag owns the rotation while the pointer is down.
      scene.environmentRotation.y += dragState.current.delta;
      dragState.current.delta = 0;
    } else if (!reducedMotion) {
      // Auto-rotation resumes the moment the pointer is released.
      scene.environmentRotation.y += ROTATION_SPEED * delta;
    }
  });

  return (
    <mesh ref={meshRef} position={ORB_POSITION} scale={ORB_SCALE}>
      {/* Primitive sphere — coded directly, no imported/generated mesh. */}
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial metalness={1} roughness={ROUGHNESS} envMapIntensity={1} />
    </mesh>
  );
}

// dragState is a ref created in OrbHero (outside the Canvas reconciler) and
// mutated by the wrapper's DOM pointer handlers — refs are plain objects, so
// reading it here inside useFrame is safe across the two renderers.
export default function OrbScene({ dragState, reducedMotion }) {
  return (
    <Canvas
      camera={CAMERA}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      {/* Reflections load in their own Suspense so the orb renders immediately
          (as bare chrome) and the mountain reflection pops in once ready —
          background={false} keeps the canvas transparent around the orb. */}
      <Suspense fallback={null}>
        <Reflections />
      </Suspense>
      {/* A faint key light adds a moving specular glint on the chrome; the
          Environment does the real reflective work. */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={0.4} />
      <Orb dragState={dragState} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
