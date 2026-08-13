import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const F1AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !hasStarted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasStarted]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(err => console.error("Audio playback error:", err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-data">
      <audio 
        ref={audioRef} 
        src="/audio/f1_theme.mp3" 
        loop 
        preload="auto"
      />

      {/* Compact Icon-Only Music Toggle Circle Button */}
      <button
        onClick={toggleAudio}
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md ${
          isPlaying
            ? 'bg-[#08080A]/90 border-[#00D2BE] text-[#00D2BE] shadow-[0_0_25px_rgba(0,210,190,0.8)] scale-105'
            : 'bg-[#08080A]/90 border-[#E10600] text-[#E10600] shadow-[0_0_15px_rgba(225,6,0,0.5)] hover:border-white hover:text-white'
        }`}
        title={isPlaying ? "Mute Soundtrack" : "Play Soundtrack"}
      >
        {isPlaying ? (
          <div className="flex items-end space-x-0.5 h-4">
            <span className="w-1 bg-[#00D2BE] animate-[bounce_0.6s_infinite_100ms] rounded-full h-full" />
            <span className="w-1 bg-[#00D2BE] animate-[bounce_0.6s_infinite_300ms] rounded-full h-2/3" />
            <span className="w-1 bg-[#00D2BE] animate-[bounce_0.6s_infinite_200ms] rounded-full h-4/5" />
          </div>
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
