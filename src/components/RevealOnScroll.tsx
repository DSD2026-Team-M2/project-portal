import { createElement, type ReactNode, useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
  as?: "div" | "section" | "article";
  children: ReactNode;
  className?: string;
  id?: string;
  immediate?: boolean;
};

export function RevealOnScroll({ as, children, className = "", id, immediate = false }: RevealOnScrollProps) {
  const Component = as ?? "div";
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(immediate);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (immediate) {
      setIsVisible(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Keep above-the-fold sections visible on first paint instead of hiding them behind scroll-triggered motion.
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.9) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [immediate]);

  return createElement(
    Component,
    {
      id,
      ref,
      className: `${className} transition duration-700 motion-reduce:transition-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`,
    },
    children,
  );
}
