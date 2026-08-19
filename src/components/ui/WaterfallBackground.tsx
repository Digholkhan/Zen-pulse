'use client';

import React, { useEffect, useRef } from 'react';

export const WaterfallBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle stream setup for soft waterfall effect
    const numStreams = Math.floor(width / 35);
    const droplets: {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
      width: number;
    }[] = [];

    for (let i = 0; i < numStreams * 3; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.5 + Math.random() * 3.5,
        length: 20 + Math.random() * 60,
        opacity: 0.05 + Math.random() * 0.15,
        width: 1 + Math.random() * 1.8,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw gentle cascading water streams
      droplets.forEach((drop) => {
        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length);
        gradient.addColorStop(0, `rgba(16, 239, 156, 0)`);
        gradient.addColorStop(0.5, `rgba(16, 239, 156, ${drop.opacity})`);
        gradient.addColorStop(1, `rgba(0, 204, 122, ${drop.opacity * 0.4})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = drop.width;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        // Move downward
        drop.y += drop.speed;

        // Reset to top when off-screen
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60 transition-opacity"
    />
  );
};
