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
      let rawHeading = 0;

      if (event.webkitCompassHeading !== undefined) {
        rawHeading = event.webkitCompassHeading;
      } else if (event.absolute && event.alpha !== null) {
        rawHeading = 360 - event.alpha;
      } else if (event.alpha !== null) {
        rawHeading = 360 - event.alpha;
      } else {
        return;
      }

      const smoothed = lowPass(headingRef.current, rawHeading, smoothing);
      headingRef.current = normalizeAngle(smoothed);

      setData({
        heading: headingRef.current,
        accuracy: event.webkitCompassAccuracy || 0,
        isSupported: true,
        error: null,
      });
    };

    // Chrome Android uses deviceorientationabsolute for absolute compass
    const hasAbsolute = typeof (window as any).ondeviceorientationabsolute !== 'undefined';
    if (hasAbsolute) {
      (window as any).addEventListener('deviceorientationabsolute', handleOrientation);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (hasAbsolute) {
        (window as any).removeEventListener('deviceorientationabsolute', handleOrientation);
      } else {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [smoothing, hasPermission]);

  return { ...data, requestAccess, hasPermission };
};
