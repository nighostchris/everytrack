export function calculateInterpolateColor(startColor: string, endColor: string, value: number) {
  // Convert hex color strings to RGB format
  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  // Convert RGB format to hex color string
  const rgbToHex = (rgb: [number, number, number]): string => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const [r1, g1, b1] = hexToRgb(startColor);
  const [r2, g2, b2] = hexToRgb(endColor);

  // Interpolate the RGB values
  const r = Math.floor(r1 + (r2 - r1) * value);
  const g = Math.floor(g1 + (g2 - g1) * value);
  const b = Math.floor(b1 + (b2 - b1) * value);

  return rgbToHex([r, g, b]);
}
