"use client";

import { useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";


export default function ProjectScene() {
    const sphere1 = useMemo(() => {
        const count = 5001; // Multiple of 3
        const data = new Float32Array(count);
        const r = 1.5;
        for (let i = 0; i < count; i += 3) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(Math.max(-1, Math.min(1, 2 * v - 1))); // Safe clamp
            const radius = Math.cbrt(Math.random()) * r;
            data[i] = radius * Math.sin(phi) * Math.cos(theta);
            data[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            data[i + 2] = radius * Math.cos(phi);
        }
        return data;
    }, []);

    const sphere2 = useMemo(() => {
        const count = 5001;
        const data = new Float32Array(count);
        const r = 2.5;
        for (let i = 0; i < count; i += 3) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(Math.max(-1, Math.min(1, 2 * v - 1))); // Safe clamp
            const radius = Math.cbrt(Math.random()) * r;
            data[i] = radius * Math.sin(phi) * Math.cos(theta);
            data[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            data[i + 2] = radius * Math.cos(phi);
        }
        return data;
    }, []);

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points positions={sphere1} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
            <Points positions={sphere2} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#bc13fe"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
