import React, { useEffect, useRef, useState } from 'react';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    // Hide scrollbars completely during opening
    document.body.style.overflow = 'hidden';

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

    // Minimal elegant automotive path crossing all the way from left to right
    const waypoints = [
      { x: -0.05, y: 0.50 },
      { x: 0.20, y: 0.50 },
      { x: 0.35, y: 0.44 },
      { x: 0.50, y: 0.44 },
      { x: 0.65, y: 0.52 },
      { x: 0.80, y: 0.52 },
      { x: 1.10, y: 0.46 }
    ];

    const totalDuration = 2200; // Fast, punchy 2.2s
    let startTime: number | null = null;
    const history: Array<{ x: number; y: number }> = [];

    const getInterpolatedPoint = (t: number) => {
      const scaledT = t * (waypoints.length - 1);
      const idx = Math.min(Math.floor(scaledT), waypoints.length - 2);
      const segmentT = scaledT - idx;
      
      const smoothT = segmentT * segmentT * (3 - 2 * segmentT);
      const p0 = waypoints[idx];
      const p1 = waypoints[idx + 1];

      return {
        x: (p0.x + (p1.x - p0.x) * smoothT) * width,
        y: (p0.y + (p1.y - p0.y) * smoothT) * height
      };
    };

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      ctx.fillStyle = 'rgba(5, 6, 7, 0.28)';
      ctx.fillRect(0, 0, width, height);

      if (progress < 1) {
        const currentPt = getInterpolatedPoint(progress);
        history.push({ x: currentPt.x, y: currentPt.y });

        // Draw clean luminous line
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer glow
        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const pt = history[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Core white beam
        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const pt = history[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Leading head spark
        const headGrad = ctx.createRadialGradient(currentPt.x, currentPt.y, 0, currentPt.x, currentPt.y, 18);
        headGrad.addColorStop(0, '#FFFFFF');
        headGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.85)');
        headGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(currentPt.x, currentPt.y, 18, 0, Math.PI * 2);
        ctx.fill();

        if (history.length > 55) {
          history.shift();
        }

        animationFrameId = requestAnimationFrame(render);
      } else {
        // Instantly fade directly to the main site
        setIsFading(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          onComplete();
        }, 350);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        document.body.style.overflow = '';
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#050607] flex flex-col items-center justify-between py-12 transition-opacity duration-300 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Header during boot */}
      <div className="relative z-10 font-mono text-[10px] tracking-widest text-[#64748B] uppercase">
        NASA SOH INTELLIGENCE LAB
      </div>

      {/* Understated telemetry indicator rendered right during the light animation */}
      <div className="relative z-10 text-center font-mono text-xs tracking-widest space-y-1">
        <div className="text-[#00F0FF] font-semibold">
          INITIALIZING PREDICTIVE ENGINE
        </div>
        <div className="text-[10px] text-[#475569]">
          RANDOMIZED USE → HEALTH SIGNAL → EXPLAINABLE MODEL
        </div>
      </div>

      {/* Skip button */}
      <button 
        onClick={() => {
          document.body.style.overflow = '';
          onComplete();
        }}
        className="relative z-10 text-[10px] font-mono tracking-widest text-[#64748B] hover:text-[#00F0FF] transition-colors uppercase border border-[#1B2028] px-3 py-1 rounded-sm bg-[#090A0D]"
      >
        SKIP [ESC]
      </button>
    </div>
  );
};
