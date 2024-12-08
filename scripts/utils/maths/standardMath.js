// Fast absolute value
export function abs(x) {
    return Math.abs(x);
}

// Fast floor function
export function floor(x) {
    return Math.floor(x);
}

// Fast ceiling function
export function ceil(x) {
    return Math.ceil(x);
}

// Fast round function
export function round(x) {
    return Math.round(x);
}

// Fast square root (less accurate but faster)
export function sqrt(x) {
    return Math.sqrt(x);
}

// Fast inverse square root (Quake III Arena method)
export function invSqrt(x) {
    const halfx = 0.5 * x;
    let y = x;
    let i = new Float32Array(1);
    i[0] = x;
    i = 0x5f3759df - (i[0] >> 1);
    y = new Float32Array([i])[0];
    y = y * (1.5 - halfx * y * y);
    return y;
}

// Fast distance between two 3D points
export function distance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
}

export function square(x) {
    return Math.pow(x, 2);
}

// Fast check if a number is within a range
export function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}

// Fast linear interpolation
export function lerp(start, end, t) {
    return start + t * (end - start);
}

// Fast clamp function
export function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

export function countTrue(arr) {
    return arr.filter(Boolean).length;
}

export function hypot(x, y) {
    return Math.hypot(x, y);
}

export function exp(x) {
    try {
        const n = 20; // Number of terms in the Taylor series expansion
        let result = 1;
        let term = 1;
        
        for (let i = 1; i < n; i++) {
            term *= x / i;
            result += term;
        }
        
        return result;
    } catch (e) {
        console.warn("[FastExp] Error: " + e);
        return Math.exp(x);
    }
}

export function pow(base, exponent) {
    return Math.pow(base, exponent);
}
export function log(x) {
    return Math.log(x);
}

export function atan2(y, x) {
    return Math.atan2(y, x);
}
export function atan(x) {
    return Math.atan(x);
}

export function sin(x) {
    return Math.sin(x);
}

export function cos(x) {
    return Math.cos(x);
}

export function tan(x) {
    return Math.tan(x);
}
export const PI = Math.PI;
