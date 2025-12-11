"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.cjs";

export default function ProjectScene() {
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points positions={random.inSphere(new Float32Array(5000), { radius: 1.5 }) as Float32Array} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
            <Points positions={random.inSphere(new Float32Array(5000), { radius: 2.5 }) as Float32Array} stride={3} frustumCulled={false}>
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
