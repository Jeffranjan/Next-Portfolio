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
        title: "Mahadev Computers",
        description: "A modern, full-featured e-commerce platform, built with the latest web technologies to ensure a seamless and secure shopping experience.",
        tags: ["Next.js", "Supbase", "Tailwind CSS", "Razorpay", "Fuse.js"],
        image: "/images/mahadev-computers.png",
        link: "https://next-project-phi-peach.vercel.app",
        github: "https://github.com/Jeffranjan/NextProject.git",
    },
    {
        id: "2",
        title: "E-commerce Shopping",
        description: "A comprehensive e-commerce application with an admin dashboard for selling laptops and computer accessories built with the MERN stack.",
        tags: ["React", "Node.js", "MongoDB", "Express.js", "Cloudinary", "Stripe"],
        image: "/images/ecommerce.png",
        link: "https://e-com-laptop-store-front-end.onrender.com/auth/login",
        github: "https://github.com/Jeffranjan/E-Com-Laptop-Store.git",
    },
    {
        id: "3",
        title: "TwoGood",
        description: "A modern JavaScript website with scroll animations using Gsap.",
        tags: ["JavaScript", "Gsap", "Node.js"],
        image: "/images/twogood.png",
        link: "https://jeffranjan.github.io/Two-Good/",
        github: "https://github.com/Jeffranjan/Two-Good.git",
    },
];
