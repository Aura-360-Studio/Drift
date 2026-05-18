import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompass } from './hooks/useCompass';
import { useGeolocation } from './hooks/useGeolocation';
import { useMagnetometer } from './hooks/useMagnetometer';
import CompassDial from './components/compass/CompassDial';
import { MapPin, Navigation, Settings, ShieldCheck, WifiOff, Activity, X, Bike, Compass as CompassIcon } from 'lucide-react';
import QRCode from 'react-qr-code';

function App() {
  const { heading, isSupported } = useCompass(0.15);
  const location = useGeolocation();
  const mag = useMagnetometer();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSplash, setShowSplash] = useState(true);
  const [showLab, setShowLab] = useState(false);
  const [lockedHeading, setLockedHeading] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) || 
                             (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) || 
                             window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const timer = setTimeout(() => setShowSplash(false), 2000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  const getCardinal = (angle: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 selection:bg-brand-accent/30 font-sans relative overflow-hidden">
        {/* Background Ambient Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* High-Speed Light Trails (Bike Line Animation) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {Array.from({ length: 15 }).map((_, i) => {
            const topPosition = Math.random() * 100;
            const width = Math.random() * 200 + 50;
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 2;
            const isLeftToRight = Math.random() > 0.5;

            return (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent shadow-[0_0_10px_rgba(255,59,48,0.8)]"
                style={{
                  top: `${topPosition}%`,
                  width: `${width}px`,
                  left: isLeftToRight ? '-300px' : '100%',
                }}
                animate={{
                  x: isLeftToRight ? ['0vw', '120vw'] : ['0vw', '-120vw'],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "linear"
                }}
              />
            );
          })}
        </div>

        {/* Animated Road & Vehicles */}
        <div className="absolute bottom-0 left-0 right-0 h-24 border-t border-white/10 bg-[#050505] overflow-hidden pointer-events-none z-0">
          {/* Moving Dashed Line (Road markings) */}
          <motion.div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9zdmc+')] -translate-y-1/2 w-[200%]"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          
          {/* Scooter / Moped (Simulated with a custom icon/shape) */}
          <motion.div
            className="absolute top-4 text-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            initial={{ x: '-100px' }}
            animate={{ x: '100vw' }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear", delay: 2 }}
          >
            <div className="flex flex-col items-center">
              {/* Scooter shape using CSS */}
              <div className="relative w-12 h-8">
                <div className="absolute bottom-0 left-1 w-3 h-3 border-2 border-white rounded-full bg-bg-deep animate-spin" />
                <div className="absolute bottom-0 right-1 w-3 h-3 border-2 border-white rounded-full bg-bg-deep animate-spin" />
                <div className="absolute bottom-1.5 left-2 right-2 h-1 bg-white rounded-full" />
                <div className="absolute bottom-2 right-3 w-1 h-5 bg-white -rotate-12" />
                <div className="absolute top-1 right-2 w-3 h-1 bg-white rounded-full" />
                <div className="absolute bottom-2 left-3 w-4 h-3 bg-white/20 rounded-t-lg" />
              </div>
            </div>
          </motion.div>

          {/* Bike */}
          <motion.div
            className="absolute top-8 text-brand-accent drop-shadow-[0_0_15px_rgba(255,59,48,0.8)]"
            initial={{ x: '-100px' }}
            animate={{ x: '100vw' }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          >
            <Bike className="w-8 h-8" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Centered Card */}
        <div className="relative z-10 bg-[#121212] border border-white/5 rounded-3xl p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6">
          
          {/* Top Icon */}
          <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-2 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-brand-accent" />
          </div>

          {/* Headings */}
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Drift is a <span className="text-brand-accent block">Mobile-First</span> Experience
            </h1>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              To enjoy our hardware-aware sensors and immersive full-screen interactions, please visit this site on your mobile device.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="relative mt-4">
            <div className="absolute -inset-2 bg-brand-accent/20 rounded-2xl blur-lg animate-pulse" />
            <div className="relative bg-white p-4 rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,59,48,0.3)]">
              <QRCode 
                value={window.location.href} 
                size={160}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          </div>

          {/* Scan Instructions */}
          <div className="space-y-1">
            <p className="text-brand-accent text-xs font-bold uppercase tracking-widest">
              Scan to Deploy on Mobile
            </p>
            <p className="text-white/30 text-[10px]">
              Install as a PWA for the full Drift App experience.
            </p>
          </div>

          {/* Explore Anyway Button */}
          <button 
            onClick={() => setIsMobile(true)}
            className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-white/60 hover:text-white transition-all uppercase tracking-wider"
          >
            Explore Anyway
          </button>

        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-brand-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sensor Not Found</h1>
          <p className="text-white/60 leading-relaxed">
            Sorry, your device currently doesn't support advanced compass sensors in web apps.
          </p>
          <button className="w-full py-4 bg-white text-black font-semibold rounded-2xl active:scale-95 transition-transform">
            I'm Interested in Native App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-deep text-brand-primary selection:bg-brand-accent/30 overflow-hidden font-sans">
      
      {/* Global CRT Scanline Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-10 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              <h1 className="text-6xl font-black tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">DRIFT</h1>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 48, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                className="h-1 bg-brand-accent mt-4 rounded-full shadow-[0_0_15px_rgba(255,59,48,0.6)]" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">DRIFT</h1>
            {isOffline && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/60 uppercase tracking-widest">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Sensor Utility v1.0</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center pt-16 pb-32 px-6">
        {/* Info Pill */}
        <div className="mb-8 px-4 py-2 bg-white/5 border border-white/10 rounded-full flex gap-4 text-[10px] font-mono tracking-widest text-white/50">
          <span>LAT: {location.lat ? location.lat.toFixed(4) : '---'}</span>
          <span>LON: {location.lng ? location.lng.toFixed(4) : '---'}</span>
        </div>

        {/* Compass Display */}
        <div className="flex flex-col items-center gap-12">
          <div className="text-center space-y-2 relative">
            {/* HUD Bracket */}
            <div className="absolute -inset-8 border border-brand-accent/20 rounded-2xl pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-accent rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-accent rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-accent rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-accent rounded-br-xl" />
            </div>

            <motion.div 
              className="text-[6rem] leading-none font-black tracking-tighter flex items-center justify-center font-mono text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] relative py-2 px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="z-10">{Math.round(heading).toString().padStart(3, '0')}</span>
              <div className="absolute left-full top-6 flex items-baseline pl-2">
                <span className="text-3xl font-normal text-brand-accent/50">°</span>
                <span className="text-3xl ml-2 font-bold text-brand-secondary tracking-widest w-8 text-left">{getCardinal(heading)}</span>
              </div>
            </motion.div>
          </div>

          <CompassDial heading={heading} lockedHeading={lockedHeading} />

          {/* Direction Lock Button */}
          <button 
            onClick={() => setLockedHeading(lockedHeading === null ? heading : null)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-500
              ${lockedHeading !== null 
                ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_20px_rgba(255,59,48,0.3)]' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}
            `}
          >
            <Navigation className={`w-4 h-4 ${lockedHeading !== null ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {lockedHeading !== null ? 'Direction Locked' : 'Lock Heading'}
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation Dashboard */}
      <nav className="fixed bottom-0 inset-x-0 pb-safe pt-2 px-6 bg-bg-elevated/90 backdrop-blur-3xl border-t border-brand-accent/20 z-40 shadow-[0_-10px_30px_rgba(0,240,255,0.05)]">
        <div className="flex justify-between items-center max-w-md mx-auto mb-4 mt-2">
          <button className="flex flex-col items-center gap-1 p-2 text-brand-accent group relative">
            <div className="absolute inset-0 bg-brand-accent/10 blur-xl rounded-full" />
            <CompassIcon className="w-6 h-6 relative z-10" />
            <span className="text-[9px] font-bold tracking-widest relative z-10">DRIFT</span>
            <div className="absolute -bottom-2 w-1 h-1 bg-brand-accent rounded-full shadow-[0_0_10px_var(--color-brand-accent)]" />
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2 text-brand-primary/40 hover:text-brand-primary transition-colors">
            <MapPin className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-widest">MAPS</span>
          </button>

          <button 
            onClick={() => setShowLab(true)}
            className="flex flex-col items-center gap-1 p-2 text-brand-primary/40 hover:text-brand-primary transition-colors hover:text-brand-secondary"
          >
            <Activity className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-widest">LAB</span>
          </button>

          <button className="flex flex-col items-center gap-1 p-2 text-brand-primary/40 hover:text-brand-primary transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-widest">PREFS</span>
          </button>
        </div>
      </nav>

      {/* Sensor Lab Modal */}
      <AnimatePresence>
        {showLab && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Sensor Lab</h2>
                <p className="text-white/40 text-xs uppercase tracking-widest">Real-time Diagnostics</p>
              </div>
              <button 
                onClick={() => setShowLab(false)}
                className="p-3 bg-white/10 rounded-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-20">
              {/* Magnetic Field */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm font-medium">Magnetic Flux</span>
                  <span className="text-brand-accent font-mono text-xl">{Math.round(mag.total)} µT</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(mag.total, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <div className="text-[10px] text-white/30 uppercase mb-1">X-Axis</div>
                    <div className="font-mono text-sm">{mag.x.toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Y-Axis</div>
                    <div className="font-mono text-sm">{mag.y.toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Z-Axis</div>
                    <div className="font-mono text-sm">{mag.z.toFixed(1)}</div>
                  </div>
                </div>
                {mag.total > 60 && (
                  <p className="text-brand-accent text-[10px] font-bold uppercase tracking-tighter animate-pulse text-center">
                    High Magnetic Interference Detected
                  </p>
                )}
              </div>

              {/* GPS Diagnostics */}
              <div className="glass-panel p-6 space-y-4">
                <span className="text-white/60 text-sm font-medium">Positioning Stability</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Lat Variance</div>
                    <div className="font-mono text-sm">{location.accuracy?.toFixed(2)}m</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-[10px] text-white/30 uppercase mb-1">Altitude</div>
                    <div className="font-mono text-sm">{location.altitude?.toFixed(1)}m</div>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="text-center p-8">
                <p className="text-white/20 text-xs leading-relaxed uppercase tracking-widest">
                  System Status: {mag.isSupported ? 'All Sensors Operational' : 'Limited Sensor Support'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100" />
      </div>
    </div>
  );
}

export default App;
