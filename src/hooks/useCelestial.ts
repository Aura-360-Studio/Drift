import { useState, useEffect } from 'react';
import * as SunCalc from 'suncalc';

export interface CelestialData {
  sunAzimuth: number;
  sunAltitude: number;
  moonAzimuth: number;
  moonAltitude: number;
  sunrise: Date | null;
  sunset: Date | null;
}

export const useCelestial = (lat: number | null, lng: number | null) => {
  const [data, setData] = useState<CelestialData | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) return;

    const updateCelestial = () => {
      const now = new Date();
      const sunPosition = SunCalc.getPosition(now, lat, lng);
      const moonPosition = SunCalc.getMoonPosition(now, lat, lng);
      const times = SunCalc.getTimes(now, lat, lng);

      // SunCalc returns azimuth in radians measured from South to West.
      // We need it in degrees measured from North to East (standard compass).
      // Conversion: CompassDeg = (azimuthInRadians * 180 / Math.PI + 180) % 360
      const radToDeg = (rad: number) => (rad * 180) / Math.PI;
      
      const formatAzimuth = (azRad: number) => {
        return (radToDeg(azRad) + 180) % 360;
      };

      setData({
        sunAzimuth: formatAzimuth(sunPosition.azimuth),
        sunAltitude: radToDeg(sunPosition.altitude),
        moonAzimuth: formatAzimuth(moonPosition.azimuth),
        moonAltitude: radToDeg(moonPosition.altitude),
        sunrise: times.sunrise,
        sunset: times.sunset,
      });
    };

    updateCelestial();
    const interval = setInterval(updateCelestial, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lat, lng]);

  return data;
};
