"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const GlobalClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = "#65a30d", // primary lime theme
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 450,
  easing = "ease-out",
  extraScale = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  // Keep canvas size exactly matching window size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  // Global document click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
    };

    window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, [sparkCount]);

  // Animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (sparksRef.current.length > 0) {
        sparksRef.current = sparksRef.current.filter((spark) => {
          const elapsed = timestamp - spark.startTime;
          if (elapsed >= duration) {
            return false;
          }

          const progress = elapsed / duration;
          const eased = easeFunc(progress);

          const distance = eased * sparkRadius * extraScale;
          const lineLength = sparkSize * (1 - eased);

          const x1 = spark.x + distance * Math.cos(spark.angle);
          const y1 = spark.y + distance * Math.sin(spark.angle);
          const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
          const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

          ctx.save();
          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();

          return true;
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, duration, easeFunc, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] select-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
