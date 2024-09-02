// Fast absolute value
export function fastAbs(x) {
    return x < 0 ? -x : x;
}

// Fast floor function
export function fastFloor(x) {
    return x | 0;
}

// Fast ceiling function
export function fastCeil(x) {
    return (x + 0.99999) | 0;
}

// Fast round function
export function fastRound(x) {
    return (x + 0.5) | 0;
}

// Fast square root (less accurate but faster)
export function fastSqrt(x) {
    return x * (1.5 - 0.5 * x * x * 0.25);
}

// Fast inverse square root (Quake III Arena method)
export function fastInvSqrt(x) {
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
export function fastDistance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return fastSqrt(dx * dx + dy * dy + dz * dz);
}

// Fast check if a number is within a range
export function fastInRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}

// Fast linear interpolation
export function fastLerp(start, end, t) {
    return start + t * (end - start);
}

// Fast clamp function
export function fastClamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

export function countTrue(arr) {
    return arr.filter(Boolean).length;
}

export function fastHypot(x, y) {
    x = fastAbs(x);
    y = fastAbs(y);
    const max = Math.max(x, y);
    const min = Math.min(x, y);
    if (max === 0) return 0;
    const ratio = min / max;
    return max * fastSqrt(1 + ratio * ratio);
}