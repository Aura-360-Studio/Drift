import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import type { CelestialData } from '../../hooks/useCelestial';

interface CompassDialProps {
  heading: number;
  lockedHeading?: number | null;
  celestialData?: CelestialData | null;
  waypointBearing?: number | null;
}

const CompassDial: React.FC<CompassDialProps> = ({ heading, lockedHeading, celestialData, waypointBearing }) => {
  const markings = Array.from({ length: 72 }, (_, i) => i * 5);
  
  return (
    <div className="relative w-80 h-80 md:w-[26rem] md:h-[26rem] flex items-center justify-center">
      {/* Ambient Glow for Glassmorphism */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-secondary/20 rounded-full blur-[60px] pointer-events-none" />

      {/* Outer Glow & Glass Bezel */}
      <div className="absolute inset-[-10px] rounded-full bg-brand-accent/5 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] pointer-events-none" />
      
      {/* Inner Depth Ring */}
      <div className="absolute inset-4 rounded-full border border-black/40 bg-gradient-to-b from-black/20 to-black/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute inset-12 rounded-full border border-dashed border-white/5 pointer-events-none animate-[spin_120s_linear_infinite_reverse]" />

      {/* Main Rotating Dial */}
      <motion.div 
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{ rotate: -heading }}
      >
        {/* Cardinal Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="absolute top-6 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">N</span>
          <span className="absolute right-8 text-xl font-bold text-white/50">E</span>
          <span className="absolute bottom-8 text-xl font-bold text-white/50">S</span>
          <span className="absolute left-8 text-xl font-bold text-white/50">W</span>
        </div>

        {/* Premium Markings */}
        {markings.map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 flex justify-center py-2 pointer-events-none"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className={`
              ${deg % 90 === 0 ? 'h-6 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 
                deg % 30 === 0 ? 'h-4 w-[2px] bg-white/70' : 'h-2 w-px bg-white/20'}
              rounded-full
            `} />
            {deg % 30 === 0 && deg % 90 !== 0 && (
              <span className="absolute top-7 text-[9px] text-white/40 font-semibold tracking-wide" style={{ transform: `rotate(${-deg}deg)` }}>
                {deg}
              </span>
            )}
          </div>
        ))}

        {/* Celestial Markers (Sky Navigation) */}
        {celestialData && (
          <>
            <div
              className="absolute inset-0 flex justify-center py-2 pointer-events-none z-20"
              style={{ transform: `rotate(${celestialData.sunAzimuth}deg)` }}
            >
              <div className="absolute top-[2.5rem] flex flex-col items-center justify-center bg-black/40 rounded-full p-1 backdrop-blur-md border border-white/5">
                <Sun className="w-3 h-3 text-yellow-400 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
              </div>
            </div>
            
            <div
              className="absolute inset-0 flex justify-center py-2 pointer-events-none z-20"
              style={{ transform: `rotate(${celestialData.moonAzimuth}deg)` }}
            >
              <div className="absolute top-[2.5rem] flex flex-col items-center justify-center bg-black/40 rounded-full p-1 backdrop-blur-md border border-white/5">
                <Moon className="w-3 h-3 text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.8)]" />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Center Pivot & Decorative Hub */}
      <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-white/10 to-white/30 border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center z-20">
        <div className="w-4 h-4 rounded-full bg-brand-accent shadow-[0_0_15px_var(--color-brand-accent)] border border-white/50" />
      </div>

      {/* 2026 Modern Hero Needle */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
         {/* Top Half of Needle (North) */}
         <div className="absolute bottom-1/2 w-2 h-24 bg-gradient-to-t from-brand-accent to-white rounded-t-full shadow-[0_0_20px_var(--color-brand-accent)]" />
         {/* Bottom Half of Needle (South) */}
         <div className="absolute top-1/2 w-1.5 h-16 bg-white/20 rounded-b-full shadow-inner" />
      </div>

      {/* Fixed Tactical Arrow Frame Indicator */}
      <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_var(--color-brand-accent)]">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white" />
        </div>
      </div>

      {/* Locked Heading Marker */}
      {lockedHeading !== null && lockedHeading !== undefined && (
        <motion.div 
          className="absolute inset-0 flex justify-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: lockedHeading - heading }}
        >
          <div className="absolute top-4 w-6 h-6 border-2 border-brand-secondary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,60,0.5)]">
            <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full" />
          </div>
        </motion.div>
      )}

      {/* Waypoint Marker */}
      {waypointBearing !== null && waypointBearing !== undefined && (
        <div
          className="absolute inset-0 flex justify-center py-2 pointer-events-none z-30"
          style={{ transform: `rotate(${waypointBearing}deg)` }}
        >
          <div className="absolute top-4 flex flex-col items-center justify-center bg-brand-accent/20 rounded-full p-1.5 backdrop-blur-md border border-brand-accent shadow-[0_0_15px_var(--color-brand-accent)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-accent">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      )}
      
      {/* Premium Glass Highlights */}
      <div className="absolute inset-0 rounded-full mix-blend-overlay pointer-events-none opacity-40 bg-gradient-to-br from-white/20 via-transparent to-black/50" />
    </div>
  );
};

export default CompassDial;

