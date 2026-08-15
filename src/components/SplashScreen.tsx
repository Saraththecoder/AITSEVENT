import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, SkipForward, Play, Zap, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Step 1: 'INTRO' ("ARE YOU READY?" screen) -> Step 2: 'VIDEO' (splash.mp4) -> Website
  const [step, setStep] = useState<'INTRO' | 'VIDEO'>('INTRO');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [startLightsCount, setStartLightsCount] = useState<number>(0);

  // F1 5-LED Start Lights animation sequence for Stage 1 (ARE YOU READY)
  useEffect(() => {
    if (step === 'INTRO') {
      const interval = setInterval(() => {
        setStartLightsCount(prev => (prev < 5 ? prev + 1 : 5));
      }, 400);

      // Auto-advance to video after 3 seconds if user doesn't tap
      const autoTimer = setTimeout(() => {
        handleProceedToVideo();
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(autoTimer);
      };
    }
  }, [step]);

  const handleProceedToVideo = () => {
    setStep('VIDEO');
  };

  // Video Autoplay & Audio Management for Stage 2
  useEffect(() => {
    if (step === 'VIDEO') {
      const video = videoRef.current;
      if (!video) return;

      // Because user interacted with Intro stage, browser allows unmuted audio!
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
          })
          .catch(() => {
            // Fallback if browser still restricts audio
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
      }

      // 7-second timer safety net
      const timer = setTimeout(() => {
        onComplete();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {});
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden select-none font-data">
      
      {/* ========================================================================= */}
      {/* STAGE 1: "ARE YOU READY?" INTRO SPLASH SCREEN */}
      {/* ========================================================================= */}
      {step === 'INTRO' && (
        <div 
          onClick={handleProceedToVideo}
          className="fixed inset-0 bg-[#08080A] flex flex-col items-center justify-center p-6 text-center space-y-8 cursor-pointer select-none z-[101]"
        >
          {/* Glowing Background Radial Laser Halos */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#E10600]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#00D2BE]/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Logo Banner */}
          <div className="relative z-10">
            <img
              src="/logo.png"
              alt="FORMULA-AI 2026 Logo"
              className="h-12 sm:h-20 w-auto max-w-[280px] sm:max-w-[420px] object-contain drop-shadow-[0_0_30px_rgba(225,6,0,0.8)] animate-pulse"
            />
          </div>

          {/* 5-LED F1 Start Lights Indicator */}
          <div className="relative z-10 flex items-center space-x-3 bg-[#111115] border-2 border-[#22222a] px-6 py-2.5 rounded-full shadow-2xl">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  i < startLightsCount
                    ? i === 4
                      ? 'bg-[#22C55E] shadow-[0_0_15px_#22C55E] scale-110'
                      : 'bg-[#E10600] shadow-[0_0_15px_#E10600]'
                    : 'bg-[#22222a]'
                }`}
              />
            ))}
          </div>

          {/* Main "ARE YOU READY?" Headline */}
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#00D2BE] px-4 py-1.5 rounded-full text-xs font-mono text-[#00D2BE] shadow-[0_0_20px_rgba(0,210,190,0.4)]">
              <Zap className="w-4 h-4 text-[#00D2BE] animate-pulse" />
              <span className="font-bold tracking-widest uppercase">MONZA CIRCUIT TELEMETRY READY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-wider leading-none">
              ARE YOU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-[#F5A623] to-[#00D2BE]">READY?</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#8A8A93] font-body">
              REV UP YOUR ENGINES · FORMULA-AI 2026 GRAND PRIX
            </p>
          </div>

          {/* High-Octane Action Button */}
          <div className="relative z-10 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToVideo();
              }}
              className="group relative inline-flex items-center justify-center bg-[#E10600] hover:bg-[#ff1a1a] text-white px-8 py-4 font-display text-xs sm:text-sm font-black tracking-widest uppercase transition-all rounded-2xl shadow-[0_0_40px_rgba(225,6,0,0.8)] transform hover:scale-105 border-2 border-white/80 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 fill-current text-[#00D2BE]" />
                <span>UNLEASH RACE VIDEO →</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: VIDEO SPLASH SCREEN (splash.mp4) */}
      {/* ========================================================================= */}
      {step === 'VIDEO' && (
        <div 
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              videoRef.current.play().catch(() => {});
              setIsMuted(false);
            }
          }}
          className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {/* Centered Video */}
          <video
            ref={videoRef}
            src="/splash.mp4"
            autoPlay
            playsInline
            onEnded={onComplete}
            onError={onComplete}
            className="w-full h-full max-w-full max-h-full object-contain bg-black"
          />

          {/* Top Overlay Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <button
              onClick={handleToggleSound}
              className="p-2.5 bg-black/60 border border-white/20 hover:border-white text-white rounded-full transition-all cursor-pointer backdrop-blur-md"
              title={isMuted ? "Enable Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#E10600]" /> : <Volume2 className="w-4 h-4 text-[#00D2BE]" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="px-3.5 py-1.5 bg-black/60 border border-white/20 hover:border-white text-white text-xs font-mono font-bold uppercase rounded-full transition-all cursor-pointer backdrop-blur-md flex items-center space-x-1"
            >
              <span>SKIP TO SITE</span>
              <SkipForward className="w-3.5 h-3.5 text-[#00D2BE]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
