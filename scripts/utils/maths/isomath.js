import settings from "../../data/settings.js";

import * as fastMath from "./fastMath.js";
import * as standardMath from "./standardMath.js";

let math = null;

// We do this because this file runs before start.js for some reason so the dynamic settings havent been loaded yet causing it to always use the default which is fastMaths
// There is probably a better fix to this but... yeah it works so later me can find out if there is one
const initializeMath = () => {
  if (!math) {
    console.warn("[Isolate] Loading Math")
    math = settings.performance.fastMath ? fastMath : standardMath;
    console.warn("[Isolate] >> Loaded: " + (settings.performance.fastMath ? "Fast Math" : "Standard Math"));
  }
  return math;
};

export const abs = (x) => initializeMath().abs(x);

export const floor = (x) => initializeMath().floor(x);

export const ceil = (x) => initializeMath().ceil(x);

export const round = (x) => initializeMath().round(x);

export const sqrt = (x) => initializeMath().sqrt(x);

export const invsqrt = (x) => initializeMath().invSqrt(x);

export const distance3d = (...args) => initializeMath().distance3D(...args);

export const square = (x) => initializeMath().square(x);

export const inRange = (x, min, max) => initializeMath().inRange(x, min, max);

export const lerp = (a, b, t) => initializeMath().lerp(a, b, t);

export const clamp = (x, min, max) => initializeMath().clamp(x, min, max);

export const countTrue = (...args) => initializeMath().countTrue(...args);

export const hypot = (...args) => initializeMath().hypot(...args);

export const exp = (x) => initializeMath().exp(x);

export const pow = (x, y) => initializeMath().pow(x, y);

export const log = (x) => initializeMath().log(x);

export const atan2 = (y, x) => initializeMath().atan2(y, x);

export const atan = (x) => initializeMath().atan(x);

export const sin = (x) => initializeMath().sin(x);

export const cos = (x) => initializeMath().cos(x);

export const tan = (x) => initializeMath().tan(x);

export const pythag = (a, b) => initializeMath().pythag(a, b);

export const pi = () => initializeMath().PI;

export function reloadMath() {
    math = null;
    initializeMath();
}

// Any functions below this don't change with the fastMath toggle

export function getStandardDeviation(values, average) {
  const variance = values.reduce((acc, val) => { const diff = val - average; return acc + diff * diff; }, 0) / values.length; 
  return Math.sqrt(variance);
}

export function getAverage(data) {
  const values = Array.isArray(data) ? data : Array.from(data.values());

  return values.reduce((acc, val) => acc + val, 0) / values.length;
}

export function max(list) {
  const values = Array.isArray(list) ? list : Array.from(list.values());
  return values.reduce((max, val) => val > max ? val : max, -Infinity);
}

export function min(list) {
  const values = Array.isArray(list) ? list : Array.from(list.values());
  return values.reduce((min, val) => val < min ? val : min, Infinity);
}

export function range(list) {
  return max(list) - min(list);
}

export function lessThan(data, threshold) {
  const values = Array.isArray(data) ? data : Array.from(data.values());

  return values.reduce((count, val) => val < threshold ? count + 1 : count, 0);
}

export function greaterThan(data, threshold) {
  const values = Array.isArray(data) ? data : Array.from(data.values());

  return values.reduce((count, val) => val > threshold ? count + 1 : count, 0);
}