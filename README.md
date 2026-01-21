# Futuristic Portfolio - Ranjan Gupta

![Project Banner](https://ranjangupta.online/opengraph-image.png)

A cutting-edge, futuristic personal portfolio website built with Next.js, TypeScript, and 3D technologies. This project showcases a "Neo-Arc" aesthetic, combining terminal-inspired UI, neon accents, and interactive 3D elements to create an immersive developer experience.

[**Live Demo**](https://next-portfolio-git-main-ranjan-guptas-projects.vercel.app)

## 🚀 Features

-   **Futuristic "Neo-Arc" Design**: Terminal-inspired UI, glassmorphism, and neon aesthetics.
-   **Comprehensive Admin Dashboard**:
    -   **Content Management**: Full CRUD operations for Blogs, Projects, Experiences, and Skills.
    -   **Real-time Analytics**: Live visitor stats, page views, and device breakdown powered by Supabase Realtime.
    -   **Audit & Trash System**: Robust data safety with activity logging, soft-deletes, and restore capabilities.
-   **Blog/Article Management**: Rich text editor support for creating and managing technical articles.
-   **Interactive 3D Elements**: Immersive scenes powered by Three.js and React Three Fiber.
-   **Smooth Animations**: Fluid transitions and micro-interactions using Framer Motion and GSAP.
-   **Responsive Layout**: Fully optimized pixel-perfect design for mobile, tablet, and desktop.
-   **Contact Integration**: Secure contact form handling with Resend.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Backend & Database**:
    -   [Supabase](https://supabase.com/) (Postgres, Auth, Storage, Realtime)
-   **Animations & 3D**:
    -   [Framer Motion](https://www.framer.com/motion/)
    -   [GSAP](https://greensock.com/gsap/)
    -   [Three.js](https://threejs.org/)
    -   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
-   **UI Components & Utilities**:
    -   [Recharts](https://recharts.org/) (Data Visualization)
    -   [Sonner](https://sonner.emilkowal.ski/) (Toast Notifications)
    -   [Lucide React](https://lucide.dev/) (Icons)
-   **Email Service**: [Resend](https://resend.com/)

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router
│   ├── (public)/     # Public facing pages (Home, Projects, etc.)
│   ├── admin/        # Protected Admin Dashboard routes & features
│   └── api/          # API Routes for database interactions
├── components/       # Reusable UI components
│   ├── canvas/       # 3D scenes and canvas elements
│   ├── ui/           # Design system components
│   └── admin/        # Admin-specific components
├── hooks/            # Custom React hooks (realtime, auth, etc.)
├── lib/              # Utilities, Supabase client, type definitions
└── styles/           # Global styles and configuration
```

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Environment Setup

Create a `.env.local` file in the root directory and add your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
# Add other necessary keys for admin access
```

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/next-portfolio.git
    cd next-portfolio
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Based on the [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
