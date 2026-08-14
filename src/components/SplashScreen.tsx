import React, { useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser Autoplay Policy blocks unmuted audio on cold load,
          // attach immediate one-time gesture listeners to force unmuted audio on first touch/click
          const enableAudioOnGesture = () => {
            if (video) {
              video.muted = false;
              video.volume = 1.0;
              video.play().catch(() => {});
            }
            window.removeEventListener('click', enableAudioOnGesture);
            window.removeEventListener('touchstart', enableAudioOnGesture);
            window.removeEventListener('keydown', enableAudioOnGesture);
          };

          window.addEventListener('click', enableAudioOnGesture, { once: true });
          window.addEventListener('touchstart', enableAudioOnGesture, { once: true });
          window.addEventListener('keydown', enableAudioOnGesture, { once: true });
        });
      }
    }

    // 7-second timer to transition automatically to main site
    const timer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleContainerClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      onTouchStart={handleContainerClick}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Clean Centered Responsive Video with Automatic Sound */}
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
