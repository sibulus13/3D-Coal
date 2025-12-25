"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function createRealisticCoalChunk(
  baseRadius: number,
  irregularity: number = 0.35,
  seed: number = Math.random()
) {
  const geometry = new THREE.IcosahedronGeometry(baseRadius, 4);
  const positions = geometry.attributes.position;
  const noise3D = createNoise3D(() => seed);
  const noise3DCoarse = createNoise3D(() => seed + 500);
  const noise3DMid = createNoise3D(() => seed + 1000);
  const noise3DFine = createNoise3D(() => seed + 2000);
  const noise3DDetail = createNoise3D(() => seed + 3000);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const distance = Math.sqrt(x * x + y * y + z * z);
    const normalizedX = x / distance;
    const normalizedY = y / distance;
    const normalizedZ = z / distance;

    const scale1 = 0.8;
    const noiseValue1 = noise3D(
      normalizedX * scale1,
      normalizedY * scale1,
      normalizedZ * scale1
    );

    const scale2 = 1.8;
    const noiseValue2 = noise3DCoarse(
      normalizedX * scale2,
      normalizedY * scale2,
      normalizedZ * scale2
    );

    const scale3 = 4.0;
    const noiseValue3 = noise3DMid(
      normalizedX * scale3,
      normalizedY * scale3,
      normalizedZ * scale3
    );

    const scale4 = 8.0;
    const noiseValue4 = noise3DFine(
      normalizedX * scale4,
      normalizedY * scale4,
      normalizedZ * scale4
    );

    const scale5 = 16.0;
    const noiseValue5 = noise3DDetail(
      normalizedX * scale5,
      normalizedY * scale5,
      normalizedZ * scale5
    );

    const displacement1 = noiseValue1 * irregularity * baseRadius * 0.35;
    const displacement2 = noiseValue2 * irregularity * baseRadius * 0.3;
    const displacement3 = noiseValue3 * irregularity * baseRadius * 0.2;
    const displacement4 = noiseValue4 * irregularity * baseRadius * 0.1;
    const displacement5 = noiseValue5 * irregularity * baseRadius * 0.05;

    const totalDisplacement =
      displacement1 +
      displacement2 +
      displacement3 +
      displacement4 +
      displacement5;
    const newDistance = distance + totalDisplacement;

    positions.setX(i, normalizedX * newDistance);
    positions.setY(i, normalizedY * newDistance);
    positions.setZ(i, normalizedZ * newDistance);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function createCoalPiece() {
  const chunks: THREE.BufferGeometry[] = [];

  const mainChunk = createRealisticCoalChunk(1.4, 0.4, Math.random());
  const matrix = new THREE.Matrix4();
  matrix.makeScale(1.1, 1.3, 0.9);
  matrix.setPosition(0, 0, 0);
  mainChunk.applyMatrix4(matrix);
  chunks.push(mainChunk);

  const chunk1 = createRealisticCoalChunk(0.8, 0.38, Math.random());
  const matrix1 = new THREE.Matrix4();
  matrix1.makeScale(0.9, 1.0, 0.8);
  matrix1.makeRotationX(0.2);
  matrix1.makeRotationY(0.3);
  matrix1.setPosition(0.7, -0.3, 0.5);
  chunk1.applyMatrix4(matrix1);
  chunks.push(chunk1);

  const chunk2 = createRealisticCoalChunk(0.7, 0.36, Math.random());
  const matrix2 = new THREE.Matrix4();
  matrix2.makeScale(0.85, 0.95, 0.75);
  matrix2.makeRotationX(-0.15);
  matrix2.makeRotationY(0.4);
  matrix2.setPosition(-0.6, 0.25, -0.4);
  chunk2.applyMatrix4(matrix2);
  chunks.push(chunk2);

  const chunk3 = createRealisticCoalChunk(0.5, 0.34, Math.random());
  const matrix3 = new THREE.Matrix4();
  matrix3.makeScale(0.8, 0.9, 0.7);
  matrix3.makeRotationX(0.3);
  matrix3.makeRotationY(-0.2);
  matrix3.setPosition(0.3, 0.7, -0.3);
  chunk3.applyMatrix4(matrix3);
  chunks.push(chunk3);

  const chunk4 = createRealisticCoalChunk(0.4, 0.32, Math.random());
  const matrix4 = new THREE.Matrix4();
  matrix4.makeScale(0.75, 0.85, 0.65);
  matrix4.makeRotationX(-0.25);
  matrix4.makeRotationZ(0.2);
  matrix4.setPosition(-0.4, -0.5, 0.3);
  chunk4.applyMatrix4(matrix4);
  chunks.push(chunk4);

  return mergeGeometries(chunks);
}

function Coal({
  lightIntensity,
  started,
}: {
  lightIntensity: number;
  started: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const wingsGroupRef = useRef<THREE.Group>(null);
  const coalGeometry = useMemo(() => createCoalPiece(), []);

  const haloVisibility = Math.max(0, (lightIntensity - 0.3) / 0.7);

  useFrame((state, delta) => {
    if (groupRef.current && started) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.position.y = -1.2;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.3;
      haloRef.current.position.y =
        3.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  const baseColor = useMemo(() => {
    const hue = 0;
    const saturation = 0;
    const lightness = 0.08 + Math.random() * 0.04;
    return new THREE.Color().setHSL(hue, saturation, lightness);
  }, []);

  return (
    <group ref={groupRef}>
      <mesh
        castShadow
        receiveShadow
        geometry={coalGeometry}
        scale={[1.2, 1.3, 1.1]}
      >
        <meshStandardMaterial
          color={baseColor}
          roughness={0.98}
          metalness={0.02}
          emissive="#000000"
          emissiveIntensity={lightIntensity * 0.05}
          flatShading={false}
        />
      </mesh>

      <mesh
        ref={haloRef}
        position={[0, 1.5, 0]}
        rotation={[Math.PI / 2, 0.2, 0.15]}
        scale={[0.8, 0.8, 0.325]}
      >
        <torusGeometry args={[1.2, 0.5, 12, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={haloVisibility * 3.5}
          transparent
          opacity={haloVisibility * 0.85}
          side={THREE.DoubleSide}
          toneMapped={false}
          wireframe={false}
        />
      </mesh>
    </group>
  );
}

function Scene({
  lightIntensity,
  started,
}: {
  lightIntensity: number;
  started: boolean;
}) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.shadow.camera.left = -10;
      directionalLightRef.current.shadow.camera.right = 10;
      directionalLightRef.current.shadow.camera.top = 10;
      directionalLightRef.current.shadow.camera.bottom = -10;
      directionalLightRef.current.shadow.camera.near = 0.5;
      directionalLightRef.current.shadow.camera.far = 50;
    }
  }, []);

  const spotlightIntensity = Math.max(0, (lightIntensity - 0.75) / 0.25);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={started ? lightIntensity * 0.3 : 0} />
      <directionalLight
        ref={directionalLightRef}
        position={[5, 8, 5]}
        intensity={started ? lightIntensity * 4 : 0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={started ? lightIntensity * 1.5 : 0}
        castShadow={false}
      />
      <pointLight
        position={[0, 3, 0]}
        intensity={started ? lightIntensity * 6 : 0}
        color="#fff8e1"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[-2, 2, 2]}
        intensity={started ? lightIntensity * 3 : 0}
        color="#fff8e1"
        distance={12}
        decay={2}
      />
      <pointLight
        position={[2, 2, -2]}
        intensity={started ? lightIntensity * 3 : 0}
        color="#fff8e1"
        distance={12}
        decay={2}
      />
      <spotLight
        position={[5, 6, 3]}
        target-position={[-0.3, 0.1, 0.2]}
        intensity={started ? spotlightIntensity * 20 : 0}
        angle={Math.PI / 4}
        penumbra={0.2}
        decay={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-5, 6, -3]}
        target-position={[0.3, 0.1, -0.2]}
        intensity={started ? spotlightIntensity * 20 : 0}
        angle={Math.PI / 4}
        penumbra={0.2}
        decay={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Coal lightIntensity={lightIntensity} started={started} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </>
  );
}

export default function Coal3D() {
  const [lightIntensity, setLightIntensity] = useState(0);
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMuteButton, setShowMuteButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const evilMortyRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    const darkPhaseDuration = 3000;
    const lightRevealDuration = 24000;
    const audioDelay = 3000;
    const audioFadeDuration = lightRevealDuration;
    const evilMortyDelay = 10000;
    const startTime = Date.now();
    let audioStarted = false;
    let audioStartTime = 0;
    let evilMortyStarted = false;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= audioDelay && !audioStarted && audioRef.current) {
        audioStarted = true;
        audioStartTime = Date.now();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playing");
            })
            .catch((error) => {
              console.error("Audio playback failed:", error);
            });
        }
      }

      if (
        elapsed >= evilMortyDelay &&
        !evilMortyStarted &&
        evilMortyRef.current
      ) {
        evilMortyStarted = true;
        evilMortyRef.current.currentTime = 37;
        evilMortyRef.current.volume = 0;
        const playPromise = evilMortyRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Evil Morty track playing");
            })
            .catch((error) => {
              console.error("Evil Morty playback failed:", error);
            });
        }
      }

      if (audioStarted && audioRef.current) {
        const audioElapsed = Date.now() - audioStartTime;
        const fadeProgress = Math.min(audioElapsed / audioFadeDuration, 1);
        audioRef.current.volume = fadeProgress;
      }

      if (evilMortyStarted && evilMortyRef.current) {
        const evilMortyElapsed = elapsed - evilMortyDelay;
        const evilMortyFadeStart = 5000;
        const evilMortyFadeDuration = 3000;
        if (evilMortyElapsed >= evilMortyFadeStart) {
          const fadeElapsed = evilMortyElapsed - evilMortyFadeStart;
          const fadeProgress = Math.min(fadeElapsed / evilMortyFadeDuration, 1);
          evilMortyRef.current.volume = fadeProgress * 0.8;
        }
      }

      if (elapsed < darkPhaseDuration) {
        setLightIntensity(0);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const revealElapsed = elapsed - darkPhaseDuration;
        const progress = Math.min(revealElapsed / lightRevealDuration, 1);

        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setLightIntensity(easedProgress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    };

    const timer = setTimeout(() => {
      animate();
    }, 1000);

    const muteButtonTimer = setTimeout(() => {
      setShowMuteButton(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(muteButtonTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;
      }
      if (evilMortyRef.current) {
        evilMortyRef.current.pause();
        evilMortyRef.current.currentTime = 0;
        evilMortyRef.current.volume = 1;
      }
    };
  }, [started]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <Scene lightIntensity={lightIntensity} started={started} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {!started && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => setStarted(true)}
        >
          <div
            style={{
              padding: "20px 40px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
          >
            <h2
              style={{
                color: "#fff",
                margin: "0 0 10px 0",
                fontSize: "24px",
                fontWeight: "300",
                letterSpacing: "1px",
              }}
            >
              REVEAL THE LIGHT
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0",
                fontSize: "14px",
              }}
            >
              Click to begin
            </p>
          </div>
        </div>
      )}

      {started && showMuteButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
            if (audioRef.current) {
              audioRef.current.muted = !isMuted;
            }
            if (evilMortyRef.current) {
              evilMortyRef.current.muted = !isMuted;
            }
          }}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 50,
            padding: "10px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      )}

      <audio
        ref={audioRef}
        src="/audio/carol-of-bells.mp3"
        loop
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
      <audio
        ref={evilMortyRef}
        src="/audio/evil-morty.mp3"
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
    </div>
  );
}
