import { useState, useEffect } from 'react';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0, isSupported: false });

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0,
        isSupported: true
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return orientation;
};
