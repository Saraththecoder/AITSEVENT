import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Step 1: 'INTRO' ("ARE YOU READY?" text screen) -> Step 2: 'VIDEO' (splash.mp4) -> Website
  const [step, setStep] = useState<'INTRO' | 'VIDEO'>('INTRO');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Auto-advance Stage 1 (ARE YOU READY text) to Stage 2 (Video) after 2 seconds
  useEffect(() => {
    if (step === 'INTRO') {
      const autoTimer = setTimeout(() => {
        setStep('VIDEO');
      }, 2200);

      return () => clearTimeout(autoTimer);
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

      // Because user touched/interacted with screen, browser allows unmuted audio!
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
          })
          .catch(() => {
            // Fallback if browser policy still restricts unmuted autoplay
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
      }

      // 7-second timer safety fallback
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
      {/* STAGE 1: CLEAN "ARE YOU READY?" TEXT SCREEN */}
      {/* ========================================================================= */}
      {step === 'INTRO' && (
        <div 
          onClick={handleProceedToVideo}
          onTouchStart={handleProceedToVideo}
          className="fixed inset-0 bg-[#08080A] flex flex-col items-center justify-center p-6 text-center space-y-4 cursor-pointer select-none z-[101]"
        >
          {/* Subtle Ambient Laser Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#E10600]/25 rounded-full blur-[140px] pointer-events-none" />

          {/* Clean "ARE YOU READY?" Text */}
          <div className="relative z-10 space-y-3">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase text-white tracking-widest leading-none drop-shadow-[0_0_35px_rgba(225,6,0,0.8)] animate-pulse">
              ARE YOU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-[#F5A623] to-[#00D2BE]">READY?</span>
            </h1>

            <div className="text-xs sm:text-sm text-[#00D2BE] font-mono tracking-widest uppercase font-bold animate-bounce">
              TAP ANYWHERE TO START 🏎️💨
            </div>
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
              <span>SKIP</span>
              <SkipForward className="w-3.5 h-3.5 text-[#00D2BE]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
