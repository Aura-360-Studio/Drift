import { useState, useEffect, useRef } from 'react';

export const useFlashlight = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isOn, setIsOn] = useState<boolean>(false);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    // Check if browser supports media devices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      return;
    }

    // Try to get the camera track on mount to check for torch capability
    // However, on mobile we don't want to prompt for camera permission immediately 
    // unless they use the flashlight. So we just assume it might be supported,
    // or check mediaDevices.enumerateDevices.
    
    const checkSupport = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        // We set supported to true if a camera exists, actual torch support will be verified on activation
        setIsSupported(hasCamera);
      } catch (err) {
        setIsSupported(false);
      }
    };
    
    checkSupport();

    return () => {
      if (trackRef.current) {
        trackRef.current.stop();
      }
    };
  }, []);

  const toggle = async () => {
    try {
      if (isOn && trackRef.current) {
        // Turn off
        await trackRef.current.applyConstraints({
          advanced: [{ torch: false } as any]
        });
        trackRef.current.stop();
        trackRef.current = null;
        setIsOn(false);
        return;
      }

      // Turn on
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;

      // Check if torch is actually supported by this specific track
      if (capabilities && capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: true } as any]
        });
        trackRef.current = track;
        setIsOn(true);
      } else {
        // Torch not supported on this device's camera
        track.stop();
        alert('Flashlight/Torch is not supported on your device.');
      }
    } catch (error) {
      console.error('Flashlight error:', error);
      alert('Could not access camera for flashlight. Please ensure permissions are granted.');
    }
  };

  return { isSupported, isOn, toggle };
};
