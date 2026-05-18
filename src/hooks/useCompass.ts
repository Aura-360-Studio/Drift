import { useState, useEffect, useRef } from 'react';
import { lowPass, normalizeAngle } from '../utils/math';

interface CompassData {
  heading: number;
  accuracy: number;
  isSupported: boolean;
  error: string | null;
}

export const useCompass = (smoothing = 0.1) => {
  const [data, setData] = useState<CompassData>({
    heading: 0,
    accuracy: 0,
    isSupported: true,
    error: null,
  });

  const headingRef = useRef(0);

  useEffect(() => {
    // Check for DeviceOrientationEvent support
    if (!(window as any).DeviceOrientationEvent) {
      setData(prev => ({ ...prev, isSupported: false, error: 'Sensors not supported' }));
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let rawHeading = 0;

      // WebkitCompassHeading is specific to iOS but we need a robust way for both
      if ((event as any).webkitCompassHeading !== undefined) {
        rawHeading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // alpha is rotation around z-axis (compass heading)
        // Note: alpha is 0 when the top of the device is pointing to the North pole.
        // On Android, alpha is usually in [0, 360]
        rawHeading = 360 - event.alpha;
      } else {
        setData(prev => ({ ...prev, error: 'No heading data' }));
        return;
      }

      // Smooth the heading
      const smoothed = lowPass(headingRef.current, rawHeading, smoothing);
      headingRef.current = normalizeAngle(smoothed);

      setData({
        heading: headingRef.current,
        accuracy: (event as any).webkitCompassAccuracy || 0,
        isSupported: true,
        error: null,
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    
    // For iOS 13+ we need to request permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState !== 'granted') {
            setData(prev => ({ ...prev, error: 'Permission denied' }));
          }
        })
        .catch(() => {
          setData(prev => ({ ...prev, error: 'Permission error' }));
        });
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [smoothing]);

  return data;
};
