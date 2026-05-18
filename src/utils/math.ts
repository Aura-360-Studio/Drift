/**
 * Interpolates between two angles in degrees.
 * Handles the 360 to 0 wrap-around.
 */
export const lerpAngle = (a: number, b: number, t: number) => {
  const diff = ((b - a + 180) % 360) - 180;
  return a + diff * t;
};

/**
 * Low-pass filter for smoothing sensor data.
 */
export const lowPass = (current: number, target: number, alpha: number) => {
  return current + (target - current) * alpha;
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
