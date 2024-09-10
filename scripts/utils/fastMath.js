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
    if (isNaN(x) || x < 0) {
        return NaN;
    }

    let t;
    let squareRoot = x / 2;

    if (x !== 0) {
        do {
            t = squareRoot;
            squareRoot = (t + (x / t)) / 2;
        } while (t !== squareRoot);
    }

    return squareRoot;
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

export function fastExp(x) {
    const n = 20; // Number of terms in the Taylor series expansion
    let result = 1;
    let term = 1;
    
    for (let i = 1; i < n; i++) {
        term *= x / i;
        result += term;
    }
    
    return result;
}

export function fastPow(base, exponent) {
    if (exponent === 0) return 1;
    if (base === 0) return 0;
    
    let result = 1;
    let currentBase = base;
    
    const integerPart = fastFloor(exponent);
    const fractionalPart = exponent - integerPart;
    
    // Handle integer part using exponentiation by squaring
    let n = fastAbs(integerPart);
    while (n > 0) {
        if (n & 1) {
            result *= currentBase;
        }
        currentBase *= currentBase;
        n >>= 1;
    }
    
    // Adjust result for negative integer exponents
    if (integerPart < 0) {
        result = 1 / result;
    }
    
    // Handle fractional part using Math.exp and Math.log
    if (fractionalPart !== 0) {
        result *= fastExp(fractionalPart * fastLog(base));
    }
    
    return result;
}
export function fastLog(x) {
    if (x <= 0) {
        throw new Error("Input must be positive");
    }
    
    const n = 20; // Number of terms in the series expansion
    let result = 0;
    let term = (x - 1) / (x + 1);
    let termSquared = term * term;
    
    for (let i = 1; i <= n; i += 2) {
        result += term / i;
        term *= termSquared;
    }
    
    return 2 * result;
}

export function fastAtan2(y, x) {
    const absY = fastAbs(y) + 1e-10; // Prevent division by zero
    const angle = fastAtan(y / x);
    let result;

    if (x >= 0) {
        result = angle;
    } else {
        result = y >= 0 ? angle + Math.PI : angle - Math.PI;
    }
    
    return result;
}
export function fastAtan(x) {
    const a1 = 0.99997726;
    const a3 = -0.33262347;
    const a5 = 0.19354346;
    const a7 = -0.11643287;
    const a9 = 0.05265332;
    const a11 = -0.01172120;

    const x2 = x * x;
    const x4 = x2 * x2;
    const x6 = x4 * x2;
    const x8 = x6 * x2;
    const x10 = x8 * x2;

    return x * (a1 + a3 * x2 + a5 * x4 + a7 * x6 + a9 * x8 + a11 * x10);
}
export const PI = 105414357.0 / 33554432.0 + 1.984187159361080883e-9;
