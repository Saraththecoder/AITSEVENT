// Web Audio API Synth for Traditional Indian Ambient Raga Melody (Shehnai/Flute/Tanpura simulation)

class AmbientAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.tanpuraOsc1 = null;
    this.tanpuraOsc2 = null;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Tanpura Drone (Root C#3 138.59 Hz and G#3 207.65 Hz)
    this.tanpuraOsc1 = this.ctx.createOscillator();
    this.tanpuraOsc2 = this.ctx.createOscillator();

    this.tanpuraOsc1.type = 'sine';
    this.tanpuraOsc2.type = 'triangle';

    this.tanpuraOsc1.frequency.setValueAtTime(138.59, this.ctx.currentTime); // C#3
    this.tanpuraOsc2.frequency.setValueAtTime(207.65, this.ctx.currentTime); // G#3

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.tanpuraOsc1.connect(droneGain);
    this.tanpuraOsc2.connect(droneGain);
    droneGain.connect(this.masterGain);

    this.tanpuraOsc1.start();
    this.tanpuraOsc2.start();

    // Raga Yaman / Bhairavi Shehnai Notes (Frequencies in Hz)
    // C#4, D#4, F4, G4, G#4, A#4, C5, C#5
    const yamanNotes = [277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 554.37];

    let noteIndex = 0;
    this.intervalId = setInterval(() => {
      if (!this.isPlaying) return;
      
      const freq = yamanNotes[noteIndex % yamanNotes.length];
      this.playFluteNote(freq, 1.2);

      // Organic variation pattern
      const jump = Math.floor(Math.random() * 3) + 1;
      noteIndex = (noteIndex + jump) % yamanNotes.length;
    }, 900);
  }

  playFluteNote(freq, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Subtle vibrato
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(5, this.ctx.currentTime);
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.setValueAtTime(3, this.ctx.currentTime);
    vibrato.connect(osc.frequency);
    vibrato.start();

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.2);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
    vibrato.stop(now + duration);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.tanpuraOsc1) {
      try { this.tanpuraOsc1.stop(); } catch(e) {}
    }
    if (this.tanpuraOsc2) {
      try { this.tanpuraOsc2.stop(); } catch(e) {}
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }
}

export const ambientSynth = new AmbientAudioSynth();
