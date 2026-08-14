import React, { useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Enable audio and play splash video with sound
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Fallback for strict browser autoplay policies: play muted until user taps
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }

    // 7-second timer to transition automatically to main site
    const timer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleContainerClick = () => {
    // Instantly unmute audio on tap/click if browser muted it
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Clean Centered Responsive Video with Full Audio Enabled */}
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        playsInline
        onEnded={onComplete}
        className="w-full h-full max-w-full max-h-full object-contain bg-black"
      />
    </div>
  );
};
