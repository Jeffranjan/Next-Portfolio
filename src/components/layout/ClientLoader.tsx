"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Preloader from "@/components/layout/Preloader";

export default function ClientLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    // using sessionStorage which clears when the tab/window is closed
    const hasLoaded = sessionStorage.getItem("portfolio_loaded");

    if (hasLoaded) {
      setIsLoading(false);
    } else {
      // If not loaded, we keep isLoading=true (default)
      // and let the Preloader run.
      // When it completes, we'll set the flag.
    }
  }, []);

  const handleComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("portfolio_loaded", "true");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="preloader" onComplete={handleComplete} />
        )}
      </AnimatePresence>
      {!isLoading && children}
    </>
  );
}
