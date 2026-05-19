import { useRef, useCallback } from 'react';

export const useSound = (enabled: boolean = true) => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!enabled) return;
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  }, [enabled]);

  // Clean, mechanical tick for compass rotation
  const playTick = useCallback(() => {
    if (!enabled || !audioCtx.current) return;
    const ctx = audioCtx.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

    filter.type = 'highpass';
    filter.frequency.value = 1000;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [enabled]);

  // Sci-fi UI click for locking direction
  const playLock = useCallback(() => {
    if (!enabled || !audioCtx.current) return;
    const ctx = audioCtx.current;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    osc2.frequency.setValueAtTime(1200, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.15);
  }, [enabled]);

  return { initAudio, playTick, playLock };
};
