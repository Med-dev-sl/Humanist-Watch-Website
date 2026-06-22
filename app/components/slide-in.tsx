"use client";

import { useRef, useEffect, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

const directionClasses: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  fade: "",
};

const visibleClasses: Record<Direction, string> = {
  up: "translate-y-0 opacity-100",
  down: "translate-y-0 opacity-100",
  left: "translate-x-0 opacity-100",
  right: "translate-x-0 opacity-100",
  fade: "opacity-100",
};

export default function SlideIn({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} opacity-0 ${visible ? visibleClasses[direction] : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
