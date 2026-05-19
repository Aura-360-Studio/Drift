import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CalibrationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }
    
    // Simulate calibration progress over 5 seconds
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onClose, 600); // Auto close when done
          return 100;
        }
        return p + 2; // +2% every 100ms = 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
        >
          <div className="glass-panel p-8 w-full max-w-sm border border-brand-accent/30 flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-2">Sensor Calibration</h2>
            <p className="text-white/50 text-xs mb-10 leading-relaxed px-2">
              Move your device in a figure 8 motion to realign the magnetic and gyroscopic sensors.
            </p>

            {/* 3D Phone Figure 8 Animation */}
            <div className="relative w-32 h-32 mb-10 flex items-center justify-center" style={{ perspective: '800px' }}>
              <motion.div
                animate={{
                  rotateX: [0, 60, 0, -60, 0],
                  rotateY: [0, 90, 0, -90, 0],
                  rotateZ: [0, 30, 0, -30, 0]
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="w-16 h-28 border-2 border-brand-accent rounded-[1.25rem] bg-brand-accent/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.4)] relative flex flex-col items-center justify-between py-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                 {/* Screen/Camera details to make it look like a phone */}
                 <div className="w-6 h-1.5 bg-white/20 rounded-full" />
                 <div className="flex-1 w-full mt-2 border-t border-white/10 bg-black/20 rounded-b-xl" />
              </motion.div>
              
              {/* Decorative ambient rings representing the magnetic field */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-brand-accent/30 rounded-full scale-[1.3] pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-full scale-[1.6] pointer-events-none" 
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/40">
                <span>Calibrating</span>
                <span className="text-brand-accent">{progress}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-accent shadow-[0_0_10px_var(--color-brand-accent)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalibrationModal;
