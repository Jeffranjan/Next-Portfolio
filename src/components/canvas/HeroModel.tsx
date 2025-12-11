"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Float, Text, MeshDistortMaterial } from "@react-three/drei";

export default function HeroModel() {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const { viewport } = useThree();
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // Adjust scale based on viewport width
        if (viewport.width < 5) {
            setScale(0.6); // Mobile
        } else if (viewport.width < 10) {
            setScale(0.8); // Tablet
        } else {
            setScale(1); // Desktop
        }
    }, [viewport.width]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // ... existing rotation code ...
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;

            // React to mouse
            const { x, y } = state.mouse;
            meshRef.current.rotation.x += y * 0.05;
            meshRef.current.rotation.y += x * 0.05;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh
                ref={meshRef}
                scale={hovered ? scale * 1.2 : scale}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <MeshDistortMaterial
                    color={hovered ? "#ccff00" : "#00f3ff"}
                    emissive={hovered ? "#bc13fe" : "#000000"}
                    emissiveIntensity={0.5}
                    distort={0.4}
                    speed={2}
                    wireframe={!hovered}
                />
            </mesh>
        </Float>
    );
}
