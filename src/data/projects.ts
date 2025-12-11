export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image: string; // Placeholder for now, later could be a GLTF path
    link?: string;
    github?: string;
}

export const projects: Project[] = [
    {
        id: "1",
        title: "Neon Nexus",
        description: "A cyberpunk-themed e-commerce platform with 3D product previews and real-time inventory tracking.",
        tags: ["Next.js", "Three.js", "Zustand"],
        image: "/images/project1.jpg",
        link: "https://example.com",
        github: "https://github.com",
    },
    {
        id: "2",
        title: "Quantum Dashboard",
        description: "Data visualization dashboard processing millions of records with WebGL-powered charts.",
        tags: ["React", "WebGL", "D3.js"],
        image: "/images/project2.jpg",
        link: "https://example.com",
        github: "https://github.com",
    },
    {
        id: "3",
        title: "Aether Chat",
        description: "Decentralized messaging app utilizing WebRTC and IPFS for privacy-focused communication.",
        tags: ["WebRTC", "Socket.io", "Node.js"],
        image: "/images/project3.jpg",
        link: "https://example.com",
        github: "https://github.com",
    },
];
