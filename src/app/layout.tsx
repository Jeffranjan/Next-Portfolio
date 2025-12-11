import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google"; // Generic futuristic font
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import MagneticCursor from "@/components/common/MagneticCursor";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Futuristic Portfolio",
  description: "Next.js + Three.js Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${orbitron.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black font-mono cursor-none" suppressHydrationWarning>
        <Navbar />
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
