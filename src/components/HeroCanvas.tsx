import React, { useEffect, useRef } from 'react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rect = canvas.getBoundingClientRect();
    let width = (canvas.width = rect.width || window.innerWidth);
    let height = (canvas.height = rect.height || 600);

    let mouse = { x: width * 0.5, y: height * 0.4, targetX: width * 0.5, targetY: height * 0.4 };

    const handleResize = () => {
      if (!canvas) return;
      rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      rect = canvas.getBoundingClientRect();
      // Only track if mouse is near or inside canvas
      if (e.clientY >= rect.top - 100 && e.clientY <= rect.bottom + 100) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const linesCount = 20;
    let time = 0;

    const render = () => {
      time += 0.009;
      
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.fillStyle = '#050607';
      ctx.fillRect(0, 0, width, height);

      // Subtle technical grid
      ctx.strokeStyle = 'rgba(27, 32, 40, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 56;
      const xOffset = (mouse.x - width / 2) * 0.02;
      const yOffset = (mouse.y - height / 2) * 0.02;

      ctx.beginPath();
      for (let x = xOffset % gridSize; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = yOffset % gridSize; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Topographic energy field contours (contained to hero)
      for (let i = 0; i < linesCount; i++) {
        const norm = i / linesCount;
        const baseY = height * 0.2 + norm * height * 0.7;
        
        ctx.beginPath();
        const segments = 45;
        for (let s = 0; s <= segments; s++) {
          const x = (s / segments) * width;
          
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseWave = Math.exp(-dist / 240) * 28 * Math.sin(dist * 0.035 - time * 3);

          const wave1 = Math.sin(s * 0.18 + time + i * 0.3) * 14;
          const wave2 = Math.cos(s * 0.09 - time * 0.7 + i * 0.15) * 10;
          const y = baseY + wave1 + wave2 + mouseWave;

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const alpha = 0.03 + 0.07 * (1 - Math.abs(norm - 0.5) * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Subtle focal energy glow
      const radialGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 360
      );
      radialGrad.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
      radialGrad.addColorStop(0.6, 'rgba(0, 240, 255, 0.01)');
      radialGrad.addColorStop(1, 'rgba(5, 6, 7, 0)');

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
    />
  );
};
