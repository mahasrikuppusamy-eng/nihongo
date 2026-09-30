import React, { useEffect, useRef } from 'react';

export const SakuraBackground: React.FC = () => {
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

    // Sakura Petal definition
    const petalCount = Math.min(42, Math.floor(width / 35));
    const petals: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
      swayOffset: number;
      swaySpeed: number;
    }> = [];

    const colors = [
      'rgba(255, 183, 197, 0.75)',
      'rgba(255, 209, 220, 0.65)',
      'rgba(244, 114, 182, 0.7)',
      'rgba(251, 113, 133, 0.6)',
      'rgba(254, 205, 211, 0.8)',
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.2 - 0.4,
        speedY: Math.random() * 1.2 + 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.5 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const drawPetal = (x: number, y: number, size: number, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Realistic sakura petal curve
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
      ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.swayOffset += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.swayOffset) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p.x, p.y, p.size, p.rotation, p.color);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep atmospheric backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a050d] via-[#100b18] to-[#08050d]" />

      {/* Subtle Japanese Asanoha / Seigaiha geometric texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.4) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.4) 2%, transparent 0%)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Atmospheric Crimson / Violet ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/10 blur-[120px]" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-amber-600/10 blur-[150px]" />

      {/* Mount Fuji & Torii Silhouette at the bottom horizon */}
      <div className="absolute bottom-0 inset-x-0 h-44 opacity-25 flex items-end justify-center pointer-events-none">
        <svg
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          className="w-full h-full text-neutral-900 fill-current"
        >
          {/* Mount Fuji Silhouette */}
          <path d="M 0,240 L 0,210 Q 350,210 500,80 L 550,45 Q 600,40 650,45 L 700,80 Q 850,210 1200,210 L 1200,240 Z" />
          {/* Snow cap highlight */}
          <path
            d="M 550,45 Q 600,40 650,45 L 670,65 Q 640,68 620,62 Q 600,75 580,63 Q 560,67 530,65 Z"
            fill="rgba(255, 255, 255, 0.12)"
          />
        </svg>
      </div>

      {/* Falling Sakura Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
