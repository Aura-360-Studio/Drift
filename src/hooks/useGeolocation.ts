import { useState, useEffect } from 'react';

interface LocationData {
  lat: number | null;
  lng: number | null;
  altitude: number | null;
  accuracy: number | null;
  speed: number | null;
  error: string | null;
}

export const useGeolocation = () => {
  const [data, setData] = useState<LocationData>({
    lat: null,
    lng: null,
    altitude: null,
    accuracy: null,
    speed: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setData(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          error: null,
        });
      },
      (error) => {
        setData(prev => ({ ...prev, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return data;
};
