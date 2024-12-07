import settings from "../../data/settings";

import * as fastMath from "./fastMath.js";
import * as standardMath from "./standardMath.js";

const math = settings.performance.fastMath ? fastMath : standardMath;


export const abs = math.abs || math.fastAbs;

export const floor = math.floor || math.fastFloor;

export const ceil = math.ceil || math.fastCeil;

export const round = math.round || math.fastRound;

export const sqrt = math.sqrt || math.fastSqrt;

export const invsqrt = math.invSqrt || math.fastInvSqrt;

export const distance3d = math.distance3D || math.fastDistance3D;

export const square = math.square || math.fastSquare;

export const inRange = math.inRange || math.fastInRange;

export const lerp = math.lerp || math.fastLerp;

export const clamp = math.clamp || math.fastClamp;

export const countTrue = math.countTrue;

export const hypot = math.hypot || math.fastHypot;

export const exp = math.exp || math.fastExp;

export const pow = math.pow || math.fastPow;

export const log = math.log || math.fastLog;

export const atan2 = math.atan2 || math.fastAtan2;

export const atan = math.atan || math.fastAtan;

export const pi = math.PI || math.fastPI