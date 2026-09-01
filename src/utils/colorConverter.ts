// "#RGB" / "#RRGGBB" / "#RRGGBBAA" → [r, g, b] or [r, g, b, alpha]
// with channels in [0, 1]; null if the string is not a hex color
export const hex2rgb = (hex: string): number[] | null => {
  const match = hex.match(/[a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return null;
  }
  let colorString = match[0];
  if (colorString.length === 3) {
    colorString = colorString
      .split("")
      .map(char => char + char)
      .join("");
  }
  const integer = parseInt(colorString.substring(0, 6), 16);
  const r = (integer >> 16) & 0xff;
  const g = (integer >> 8) & 0xff;
  const b = integer & 0xff;
  const rgb = [r / 255, g / 255, b / 255];
  if (colorString.length === 8) {
    const alpha = parseInt(colorString.substring(6, 8), 16) / 255;
    return [...rgb, Math.round(alpha * 100) / 100];
  }
  return rgb;
};

// input: r,g,b in [0,1]; output: [h in [0,360], s in [0,100], l in [0,100]]
export const rgb2hsl = (r: number, g: number, b: number) => {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  let s: number;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

export const rgb2hex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
  }).join("");

// input: h in [0,360], s and l in [0,1]; output: r,g,b in [0,1]
export const hsl2rgb = (h: number, s: number, l: number) => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
};
