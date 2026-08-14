import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try playing unmuted first
    video.muted = false;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser Autoplay policy blocks unmuted audio, fallback to muted autoplay so video plays visually!
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
    }

    // Attach global gesture listeners to immediately enable sound on first tap/click anywhere
    const enableAudio = () => {
      if (video) {
        video.muted = false;
        video.volume = 1.0;
        video.play().catch(() => {});
        setIsMuted(false);
        setHasInteracted(true);
      }
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };

    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });

    // 7-second timer fallback to auto-complete splash transition
    const timer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, [onComplete]);

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

  const handleContainerTap = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {});
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  return (
    <div 
      onClick={handleContainerTap}
      onTouchStart={handleContainerTap}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Clean Centered Video */}
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        playsInline
        muted
        onEnded={onComplete}
        onError={onComplete}
        className="w-full h-full max-w-full max-h-full object-contain bg-black"
      />

      {/* Unmute Hint Badge (shown if browser blocked sound initially) */}
      {isMuted && !hasInteracted && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 border border-[#00D2BE]/60 text-[#00D2BE] px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center space-x-2 animate-bounce pointer-events-none shadow-2xl">
          <VolumeX className="w-4 h-4 text-[#E10600]" />
          <span>TAP ANYWHERE FOR SOUND 🔊</span>
        </div>
      )}

      {/* Top Controls Overlay */}
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
  );
};
