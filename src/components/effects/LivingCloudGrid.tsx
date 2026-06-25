"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

const subscribeClient = () => () => {};
const getClientSnapshot = () => true;
const getServerClientSnapshot = () => false;

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
};
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.52;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 auv = vec2(uv.x * aspect, uv.y);
    vec2 amouse = vec2(uMouse.x * aspect, uMouse.y);

    vec2 toMouse = auv - amouse;
    float dist = length(toMouse);
    float repelForce = smoothstep(0.55, 0.0, dist) * 0.22;
    vec2 dir = dist > 0.0001 ? toMouse / dist : vec2(0.0);
    vec2 repelled = auv + dir * repelForce;

    float t = uTime * 0.035;
    float c1 = fbm(repelled * 2.1 + vec2(t, -t * 0.55));
    float c2 = fbm(repelled * 1.35 + vec2(-t * 0.75, t * 0.28));

    float pulse = 0.5 + 0.5 * sin(uTime * 0.5);
    c1 = smoothstep(0.05, 0.55, c1) * (0.85 + 0.15 * pulse);
    c2 = smoothstep(-0.05, 0.62, c2) * (0.85 + 0.15 * (1.0 - pulse));

    vec3 snow = vec3(1.0);
    vec3 cyan = vec3(0.0, 0.737, 0.831);
    vec3 orange = vec3(1.0, 0.341, 0.133);

    vec3 color = snow;
    color = mix(color, cyan, c1 * 0.05);
    color = mix(color, orange, c2 * 0.05);

    vec2 px = uv * uResolution;
    float cell = 48.0;
    vec2 gridUv = abs(fract(px / cell - 0.5) - 0.5);
    float line = 1.0 - smoothstep(0.0, 1.2 / cell, min(gridUv.x, gridUv.y));
    color = mix(color, vec3(0.059, 0.09, 0.164), line * 0.035);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function CloudPlane() {
  const { gl, size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(-10, -10));
  const currentMouse = useRef(new THREE.Vector2(-10, -10));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetMouse.current.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame((state, delta) => {
    const lerpF = Math.min(delta * 4.5, 1);
    currentMouse.current.lerp(targetMouse.current, lerpF);
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value.copy(currentMouse.current);
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

interface LivingCloudGridProps {
  className?: string;
}

export function LivingCloudGrid({ className }: LivingCloudGridProps) {
  const mounted = useSyncExternalStore(
    subscribeClient,
    getClientSnapshot,
    getServerClientSnapshot,
  );
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 bg-white ${className ?? ""}`}
      />
    );
  }

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 bg-white ${className ?? ""}`}
      >
        <svg
          className="size-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="lcg-static" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lcg-static)" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-white ${className ?? ""}`}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, preserveDrawingBuffer: false }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <CloudPlane />
      </Canvas>
    </div>
  );
}
