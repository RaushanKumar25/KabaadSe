"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface NavigationTransitionContextType {
  isTransitioning: boolean;
  targetUrl: string | null;
  triggerTransition: (targetUrl: string, duration?: number) => void;
}

const NavigationTransitionContext = createContext<
  NavigationTransitionContextType | undefined
>(undefined);

export function NavigationTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTransition = useCallback(
    (url: string, duration = 1200) => {
      // Clear any prior timer to prevent race conditions
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setTargetUrl(url);
      setIsTransitioning(true);

      // Trigger client-side navigation
      router.push(url);

      // Smoothly hide the splash loader after the branded transition duration
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTargetUrl(null);
      }, duration);
    },
    [router]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationTransitionContext.Provider
      value={{
        isTransitioning,
        targetUrl,
        triggerTransition,
      }}
    >
      {children}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition(): NavigationTransitionContextType {
  const context = useContext(NavigationTransitionContext);
  if (!context) {
    throw new Error(
      "useNavigationTransition must be used within a NavigationTransitionProvider"
    );
  }
  return context;
}
