"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Environment } from "@react-three/drei";

interface SceneProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function Scene({ children, className, style }: SceneProps) {
    return (
        <Canvas
            className={className}
            style={style}
            dpr={[1, 2]} // Adaptive pixel ratio for performance
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 5], fov: 50 }}
        >
            {/* Light setup for futuristic glow */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bc13fe" />

            {children}

            <Environment preset="city" />
            <Preload all />
        </Canvas>
    );
}
