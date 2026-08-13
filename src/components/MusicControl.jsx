import React from 'react';
import { Volume2, VolumeX } from './Icons';

export const MusicControl = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`}
      title={isPlaying ? 'Mute Music' : 'Play Royal Shehnai Music'}
      aria-label="Toggle Background Music"
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
};
