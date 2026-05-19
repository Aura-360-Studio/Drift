/**
 * Interpolates between two angles in degrees.
 * Handles the 360 to 0 wrap-around.
 */
export const lerpAngle = (a: number, b: number, t: number) => {
  const diff = ((((b - a) % 360) + 540) % 360) - 180;
  return a + diff * t;
};

/**
 * Low-pass filter for smoothing sensor data.
 */
export const lowPass = (current: number, target: number, alpha: number) => {
  return current + (target - current) * alpha;
};

// Haversine distance in meters
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
};

// Initial bearing in degrees
export const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const λ1 = lon1 * Math.PI / 180;
  const λ2 = lon2 * Math.PI / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360; 
};

/**
 * Normalizes an angle to 0-360 range.
 */
export const normalizeAngle = (angle: number) => {
  return ((angle % 360) + 360) % 360;
};

/**
 * Converts decimal coordinates to DMS (Degrees, Minutes, Seconds) string.
 */
export const toDMS = (coord: number, isLat: boolean) => {
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
  const direction = isLat 
    ? (coord >= 0 ? "N" : "S") 
    : (coord >= 0 ? "E" : "W");
    
  return `${degrees}°${minutes}'${seconds}" ${direction}`;
};
