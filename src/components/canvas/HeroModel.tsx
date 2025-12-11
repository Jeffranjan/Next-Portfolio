"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Float, Text, MeshDistortMaterial } from "@react-three/drei";

export default function HeroModel() {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Auto-rotation
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
                scale={hovered ? 1.2 : 1}
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
