"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const brand = {
  base: "#aa8453", // Luxury gold
  baseDark: "#96703f",
  gold: "#d4af37",
  emerald: "#10b981", // Bullish Stock Green
  rose: "#f43f5e",    // Bearish Stock Red
  chartUp: "rgba(16, 185, 129, 0.15)",
  chartDown: "rgba(244, 63, 94, 0.15)",
  fonts: {
    heading: "var(--font-syne), var(--font-playfair-display), sans-serif",
    body: "var(--font-outfit), var(--font-mulish), sans-serif",
  },
};

export const lightTheme = {
  ...brand,
  mode: "light",
  bg: "#fcfaf6", 
  heading: "#1c1917", 
  text: "#57534e", 
  ternary: "#e7e5e4", 
  soft: "#f5f5f4", 
  border: "#e7e5e4",
  white: "#ffffff",
  dark: "#1c1917",
  cardBg: "rgba(255, 255, 255, 0.8)",
  inputBg: "rgba(255, 255, 255, 0.9)",
  glow: "rgba(170, 132, 83, 0.1)",
  blurBg: "rgba(252, 250, 246, 0.6)",
};

export const darkTheme = {
  ...brand,
  mode: "dark",
  bg: "#0a0a0c", 
  heading: "#ffffff", 
  text: "#a8a29e",
  ternary: "#27272a", 
  soft: "#121214", 
  border: "rgba(255, 255, 255, 0.08)", 
  white: "#ffffff",
  dark: "#0a0a0c",
  cardBg: "rgba(18, 18, 22, 0.7)",
  inputBg: "rgba(10, 10, 12, 0.5)",
  glow: "rgba(170, 132, 83, 0.15)",
  blurBg: "rgba(10, 10, 12, 0.55)",
};

const variants = {
  "fade-up": { x: 0, y: 40, scale: 1 },
  "fade-down": { x: 0, y: -40, scale: 1 },
  "fade-left": { x: 40, y: 0, scale: 1 },
  "fade-right": { x: -40, y: 0, scale: 1 },
  "zoom-in": { x: 0, y: 0, scale: 0.92 },
};

const RevealBox = styled.div`
  opacity: 0;
  transform: ${({ $v }) => {
    const v = variants[$v] || variants["fade-up"];
    return `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
  }};
  transition:
    opacity ${({ $d }) => $d}ms cubic-bezier(0.215, 0.61, 0.355, 1),
    transform ${({ $d }) => $d}ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-delay: ${({ $delay }) => $delay}ms;
  will-change: opacity, transform;

  &.is-visible {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
`;

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const threshold = options.threshold ?? 0.1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function Reveal({
  variant = "fade-up",
  duration = 800,
  delay = 0,
  as,
  className = "",
  children,
  ...rest
}) {
  const [ref, inView] = useInView();
  return (
    <RevealBox
      as={as}
      ref={ref}
      $v={variant}
      $d={duration}
      $delay={delay}
      className={`${className} ${inView ? "is-visible" : ""}`}
      {...rest}
    >
      {children}
    </RevealBox>
  );
}
