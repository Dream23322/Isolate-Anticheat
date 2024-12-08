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
    try {
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
    } catch (e) {
        console.warn("[FastSqrt] Error: " + e);
        return Math.sqrt(x);
    }
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

export function fastSquare(x) {
    return x * x;
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
    try {
        x = fastAbs(x);
        y = fastAbs(y);
        const max = Math.max(x, y);
        const min = Math.min(x, y);
        if (max === 0) return 0;
        const ratio = min / max;
        return max * fastSqrt(1 + ratio * ratio);
    } catch (e) {
        console.warn("[FastHypot] Error: " + e);
        return Math.hypot(x, y);
    }
}

export function fastExp(x) {
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

export function fastPow(base, exponent) {
    try {
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
    } catch (e) {
        console.warn("[FastPow] Error: " + e);
        return Math.pow(base, exponent);
    }
}
export function fastLog(x) {
    try {
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
    } catch (e) {
        console.warn("[FastLog] Error: " + e);
        return Math.log(x);
    }
}

export function fastAtan2(y, x) {
    try {
        const pi_over_4 = fastPI / 4;
        const absY = fastAbs(y) + 1e-10;
        const absX = fastAbs(x) + 1e-10; 

        let angle;
        if (absX > absY) {
            angle = pi_over_4 * (y / x);
        } else {
            angle = pi_over_4 * (x / y);
        }

        if (x < 0) {
            angle = fastPI - angle;
        }
        if (y < 0) {
            angle = -angle;
        }

        return angle;
    } catch (e) {
        console.warn("[FastAtan2] Error: " + e);
        return Math.atan2(y, x);
    }
}
export function fastAtan(x) {
    try {
        const a = 0.28;
        return (fastPI / 2) * (x / (1 + a * x * x));
    } catch (e) {
        console.warn("[FastAtan] Error: " + e);
        return Math.atan(x);
    }
}

export function fastSin(x) {
    try {
        // Normalize angle to -π to π
        x = x % (2 * fastPI);
        if (x > fastPI) x -= 2 * fastPI;
        else if (x < -fastPI) x += 2 * fastPI;

        // Approximation: x - (x^3)/6 + (x^5)/120
        const x2 = x * x;
        return x * (1 - x2 / 6 + x2 * x2 / 120);
    } catch (e) {
        console.warn("[FastSin] Error: " + e);
        return Math.sin(x);
    }
}

export function fastCos(x) {
    try {
        // cos(x) = sin(x + π/2)
        return fastSin(x + Math.PI / 2);
    } catch (e) {
        console.warn("[FastCos] Error: " + e);
        return Math.cos(x);
    }
}

export function fastTan(x) {
    try {
        const sinX = fastSin(x);
        const cosX = fastCos(x);
        
        // Avoid division by zero
        if (cosX === 0) return Infinity;
        return sinX / cosX;
    } catch (e) {
        console.warn("[FastTan] Error: " + e);
        return Math.tan(x);
    }
}



export const fastPI = 105414357.0 / 33554432.0 + 1.984187159361080883e-9;
