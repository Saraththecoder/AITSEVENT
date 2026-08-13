import React, { useEffect, useRef } from 'react';

interface AsciiFlagCanvasProps {
  stageIndex?: number; // 0 to 7
}

export const AsciiFlagCanvas: React.FC<AsciiFlagCanvasProps> = ({ stageIndex = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const chars = ['>', '^', 'v', '+', '*', '1', '0', ':', '.', '#', '$'];
    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Glowing Green Matrix ASCII Chequered Flag
      const cols = 38;
      const rows = 32;
      const cellW = width / (cols + 2);
      const cellH = height / (rows + 2);
      const startX = cellW;
      const startY = cellH;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isPole = c < 3 && r > 8;
          const isFlagCloth = c >= 3 && r <= 22;
          if (!isPole && !isFlagCloth) continue;

          const waveX = Math.sin(c * 0.25 + time * 2.2 + stageIndex * 0.5) * 7;
          const waveY = Math.cos(r * 0.2 + c * 0.12 + time * 1.8) * 5;
          const isCheckeredWhite = (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0;

          const x = startX + c * cellW + waveX;
          const y = startY + r * cellH + waveY;
          const char = chars[(c + r + stageIndex) % chars.length];

          if (isPole) {
            ctx.fillStyle = `rgba(0, 210, 190, ${0.4 + Math.sin(r * 0.3 + time) * 0.3})`;
          } else if (isCheckeredWhite) {
            ctx.fillStyle = `rgba(34, 197, 94, ${0.85 + Math.sin(c * 0.2 + time) * 0.15})`;
          } else {
            ctx.fillStyle = `rgba(0, 210, 190, ${0.4 + Math.cos(r * 0.2 + time) * 0.3})`;
          }
          ctx.fillText(char, x, y);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [stageIndex]);

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[440px] relative flex items-center justify-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[#00D2BE]/5 rounded-3xl blur-3xl pointer-events-none" />

      <canvas 
        ref={canvasRef} 
        className="w-full h-full relative z-10 block"
      />
    </div>
  );
};


