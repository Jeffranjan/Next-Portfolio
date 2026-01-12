import type { Metadata } from "next";
import { Suspense } from "react";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

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
  title: "Ranjan's Portfolio",
  description: "Next.js + Three.js Portfolio",
};

import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${orbitron.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black font-mono cursor-none" suppressHydrationWarning>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Toaster position="bottom-right" theme="dark" />
        {children}
      </body>
    </html>
  );
}
