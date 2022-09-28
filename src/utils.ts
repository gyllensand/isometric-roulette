import { MathUtils, Vector3 } from "three";

declare const fxrand: () => number;

export const sortRandom = <T>(array: T[]) =>
  array.sort((a, b) => 0.5 - Math.random());

export const pickRandom = <T>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

export const sortRandomHash = <T>(array: T[]) =>
  array.sort((a, b) => 0.5 - fxrand());

export const pickRandomHash = <T>(array: T[]) =>
  array[Math.floor(fxrand() * array.length)];

export const pickRandomHashNumberFromArray = <T>(array: T[]) =>
  Math.floor(fxrand() * array.length);

export const pickRandomIntFromInterval = (min: number, max: number) => {
  return Math.floor(fxrand() * (max - min + 1) + min);
};

export const pickRandomDecimalFromInterval = (
  min: number,
  max: number,
  decimalPlaces = 2
) => {
  const rand = fxrand() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
};

export const getRandomNumber = () => fxrand();

export const pickRandomSphericalPos = () => {
  const theta = 2 * Math.PI * getRandomNumber();
  const phi = Math.acos(2 * getRandomNumber() - 1);

  return new Vector3(theta, phi, 0);
};

export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => MathUtils.lerp(x2, y2, MathUtils.inverseLerp(x1, y1, a));

export const getSizeByAspect = (size: number, aspect: number) =>
  aspect > 1 ? size : size * aspect;

export const adjustColor = (color: string, amount: number) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export const pickRandomColorWithTheme = (
  color: string,
  theme: string[],
  count: number
) => {
  const primaryColor = new Array(count).fill(null).map(() => color);

  return pickRandomHash([...primaryColor, ...theme]);
};

export const easeInOutSine = (t: number, b: number, _c: number, d: number) => {
  const c = _c - b;
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
};

export const minMaxNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
