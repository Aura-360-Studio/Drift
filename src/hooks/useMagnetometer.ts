import { useState, useEffect } from 'react';

interface MagnetometerData {
  x: number;
  y: number;
  z: number;
  total: number;
  isSupported: boolean;
}

export const useMagnetometer = () => {
  const [data, setData] = useState<MagnetometerData>({
    x: 0,
    y: 0,
    z: 0,
    total: 0,
    isSupported: true,
  });

  useEffect(() => {
    // Check if AbsoluteOrientationSensor or Magnetometer is available
    if (!('Magnetometer' in window)) {
      setData(prev => ({ ...prev, isSupported: false }));
      return;
    }

    try {
      // @ts-ignore
      const sensor = new Magnetometer({ frequency: 60 });
      
      sensor.addEventListener('reading', () => {
        const { x, y, z } = sensor;
        const total = Math.sqrt(x * x + y * y + z * z);
        setData({ x, y, z, total, isSupported: true });
      });

      sensor.addEventListener('error', (event: any) => {
        if (event.error.name === 'NotAllowedError') {
          console.error('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError') {
          console.error('Cannot connect to the sensor.');
        }
        setData(prev => ({ ...prev, isSupported: false }));
      });

      sensor.start();

      return () => sensor.stop();
    } catch (e) {
      setData(prev => ({ ...prev, isSupported: false }));
    }
  }, []);

  return data;
};
