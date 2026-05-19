import { useState, useEffect, useRef } from 'react';
import { lowPass, normalizeAngle } from '../utils/math';

interface CompassData {
  heading: number;
  accuracy: number;
  isSupported: boolean;
  error: string | null;
}

export const useCompass = (smoothing = 0.1, hapticsEnabled = true, onTick?: () => void) => {
  const [data, setData] = useState<CompassData>({
    heading: 0,
    accuracy: 0,
    isSupported: true,
    error: null,
  });
  const [hasPermission, setHasPermission] = useState<boolean | null>(() => {
    return localStorage.getItem('drift_sensor_permission') === 'granted' ? true : null;
  });

  const headingRef = useRef(0);
  const lastHapticHeading = useRef(0);
  
  // Use a ref to ensure the event listener always reads the latest haptics prop
  // without needing to constantly remove/re-add the event listener.
  const hapticsRef = useRef(hapticsEnabled);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    hapticsRef.current = hapticsEnabled;
    onTickRef.current = onTick;
  }, [hapticsEnabled, onTick]);

  const requestAccess = async () => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          localStorage.setItem('drift_sensor_permission', 'granted');
          setHasPermission(true);
        } else {
          setData(prev => ({ ...prev, error: 'Permission denied' }));
          setHasPermission(false);
          return false;
        }
      } else {
        localStorage.setItem('drift_sensor_permission', 'granted');
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
    localStorage.removeItem('drift_sensor_permission');
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

      // Calculate shortest path difference to the new raw reading
      const diff = ((((rawHeading - headingRef.current) % 360) + 540) % 360) - 180;
      
      // Update target angle continuously
      const target = headingRef.current + diff;
      
      // Smooth towards the target (standard low-pass, no modulo needed since they are continuous)
      headingRef.current = headingRef.current + (target - headingRef.current) * smoothing;

      // Haptic & Sound tick check on the continuous value
      if (Math.abs(headingRef.current - lastHapticHeading.current) >= 20) {
        if (hapticsRef.current && typeof navigator.vibrate === 'function') {
          navigator.vibrate(5);
        }
        if (onTickRef.current) {
          onTickRef.current();
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
