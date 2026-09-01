import { hex2rgb, hsl2rgb } from './colorConverter';

const insideParens = (value: string) =>
  value.substring(value.indexOf("(") + 1, value.indexOf(")"));

const parseRGB = (variableValue: string): number[] | null => {
  const parts = insideParens(variableValue).split(",").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) {
    return null;
  }
  const [r, g, b, alpha] = parts;
  const rgb = [r / 255, g / 255, b / 255];
  return alpha === undefined ? rgb : [...rgb, alpha];
};

const parseHSL = (variableValue: string): number[] | null => {
  const parts = insideParens(variableValue)
    .split(",")
    .map(part => Number(part.replace("%", "")));
  if (parts.length < 3 || parts.some(isNaN)) {
    return null;
  }
  const [h, s, l, alpha] = parts;
  return [...hsl2rgb(h, s / 100, l / 100), alpha === undefined ? 1 : alpha];
};

// "rgb(a)" / "#hex" / "hsl(a)" value → [r, g, b] or [r, g, b, alpha]
// with channels in [0, 1]; null for an unsupported or malformed value
export const processInputValue = (variableValue: string): number[] | null => {
  if (variableValue.includes("rgb")) {
    return parseRGB(variableValue);
  }
  if (variableValue.includes("#")) {
    return hex2rgb(variableValue);
  }
  if (variableValue.includes("hsl")) {
    return parseHSL(variableValue);
  }
  return null;
};
