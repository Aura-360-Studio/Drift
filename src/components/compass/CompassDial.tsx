import React from 'react';
import { motion } from 'framer-motion';

interface CompassDialProps {
  heading: number;
  lockedHeading?: number | null;
}

const CompassDial: React.FC<CompassDialProps> = ({ heading, lockedHeading }) => {
  const markings = Array.from({ length: 72 }, (_, i) => i * 5);
  
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Target Brackets Background */}
      <div className="absolute inset-[-20px] border border-white/5 rounded-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-accent/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-1 bg-brand-accent/50" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-4 bg-brand-accent/50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1 h-4 bg-brand-accent/50" />
      </div>

      {/* Inner Radar Rings */}
      <div className="absolute inset-4 rounded-full border border-brand-accent/10 pointer-events-none" />
      <div className="absolute inset-12 rounded-full border border-dashed border-white/10 pointer-events-none animate-[spin_60s_linear_infinite_reverse]" />
      <div className="absolute inset-20 rounded-full bg-brand-accent/5 blur-xl pointer-events-none" />

      {/* Main Rotating Dial */}
      <motion.div 
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{ rotate: -heading }}
      >
        {/* Cardinal Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="absolute top-2 text-3xl font-black text-brand-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">N</span>
          <span className="absolute right-3 text-xl font-bold text-brand-primary/50">E</span>
          <span className="absolute bottom-3 text-xl font-bold text-brand-primary/50">S</span>
          <span className="absolute left-3 text-xl font-bold text-brand-primary/50">W</span>
        </div>

        {/* Tactical Markings */}
        {markings.map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 flex justify-center py-1 pointer-events-none"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className={`
              ${deg % 90 === 0 ? 'h-5 w-1 bg-brand-accent shadow-[0_0_8px_var(--color-brand-accent)]' : 
                deg % 30 === 0 ? 'h-3 w-0.5 bg-brand-primary' : 'h-1.5 w-px bg-white/20'}
              rounded-full
            `} />
            {deg % 30 === 0 && deg % 90 !== 0 && (
              <span className="absolute top-5 text-[8px] text-white/40 font-mono font-bold tracking-tighter" style={{ transform: `rotate(${-deg}deg)` }}>
                {deg}
              </span>
            )}
          </div>
        ))}

        {/* High-Tech Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute w-8 h-8 rounded-full border border-brand-accent/30 flex items-center justify-center">
             <div className="w-1 h-1 bg-brand-secondary rounded-full shadow-[0_0_10px_var(--color-brand-secondary)]" />
          </div>
        </div>
      </motion.div>

      {/* Fixed Tactical Arrow */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_12px_var(--color-brand-accent)]">
          <path d="M12 0L24 20H0L12 0Z" fill="var(--color-brand-accent)" />
        </svg>
      </div>

      {/* Locked Heading Marker */}
      {lockedHeading !== null && lockedHeading !== undefined && (
        <motion.div 
          className="absolute inset-0 flex justify-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: lockedHeading - heading }}
        >
          <div className="w-0.5 h-10 bg-brand-secondary rounded-full mt-[-10px] shadow-[0_0_15px_var(--color-brand-secondary)]" />
          <div className="absolute top-10 w-4 h-4 border-2 border-brand-secondary rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-brand-secondary rounded-full" />
          </div>
        </motion.div>
      )}
      
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 rounded-full mix-blend-overlay pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default CompassDial;

