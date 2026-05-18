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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const headingRef = useRef(0);
  const lastHapticHeading = useRef(0);

  const requestAccess = async () => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setHasPermission(true);
        } else {
          setData(prev => ({ ...prev, error: 'Permission denied' }));
          setHasPermission(false);
          return false;
        }
      } else {
        setHasPermission(true);
      }
      return true;
    } catch (error) {
      setData(prev => ({ ...prev, error: 'Permission error' }));
      setHasPermission(false);
      return false;
    }
  };

  const stopAccess = () => {
    setHasPermission(false);
  };

  useEffect(() => {
    if (hasPermission === false) return;
    if (hasPermission === null && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Need user gesture first
      return;
    }

    if (!window.DeviceOrientationEvent) {
      setData(prev => ({ ...prev, isSupported: false, error: 'Sensors not supported' }));
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent | any) => {
      let rawHeading = null;

      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        rawHeading = event.webkitCompassHeading;
      } else if (event.absolute === true && event.alpha !== null) {
        rawHeading = 360 - event.alpha;
      } else if (event.alpha !== null) {
        // Fallback to relative alpha if absolute is missing
        rawHeading = 360 - event.alpha;
      }

      if (rawHeading === null) return;

      const smoothed = lowPass(headingRef.current, rawHeading, smoothing);
      headingRef.current = normalizeAngle(smoothed);

      // Subtle haptic feedback tick every 2 degrees of rotation
      if (Math.abs(headingRef.current - lastHapticHeading.current) > 2) {
        if (typeof navigator.vibrate === 'function') {
          navigator.vibrate(5);
        }
        lastHapticHeading.current = headingRef.current;
      }

      setData({
        heading: headingRef.current,
        accuracy: event.webkitCompassAccuracy || 0,
        isSupported: true,
        error: null,
      });
    };

    // Chrome Android uses deviceorientationabsolute for absolute compass
    const hasAbsolute = typeof (window as any).ondeviceorientationabsolute !== 'undefined';
    
    // Some devices have 'ondeviceorientationabsolute' but it never fires or is empty. 
    // We attach to BOTH, but 'deviceorientation' will just update the heading if 'absolute' isn't available.
    if (hasAbsolute) {
      (window as any).addEventListener('deviceorientationabsolute', handleOrientation);
    }
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      if (hasAbsolute) {
        (window as any).removeEventListener('deviceorientationabsolute', handleOrientation);
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [smoothing, hasPermission]);

  return { ...data, requestAccess, stopAccess, hasPermission };
};
