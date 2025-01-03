// Fast absolute value
export function abs(x) {
    return x < 0 ? -x : x;
}

// Fast floor function
export function floor(x) {
    return x | 0;
}

// Fast ceiling function
export function ceil(x) {
    return (x + 0.99999) | 0;
}

// Fast round function
export function round(x) {
    return (x + 0.5) | 0;
}

// Fast square root (less accurate but faster)
export function sqrt(x) {
    return x * 0.5 + (x / (x * 0.5));
}

// Fast inverse square root (Quake III Arena method)
export function fastInvSqrt(x) {
    const xhalf = 0.5 * x;
    const i = 0x5f3759df - (x >> 1);
    const y = new Float32Array([i])[0];
    return y * (1.5 - xhalf * y * y);
}

// Fast distance between two 3D points
export function fastDistance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return sqrt(dx * dx + dy * dy + dz * dz);
}

export function square(x) {
    return x * x;
}

// Fast check if a number is within a range
export function fastInRange(x, min, max) {
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
    try {
        return pythag(x, y);
    } catch (e) {
        console.warn("[FastHypot] Error: " + e);
        return Math.hypot(x, y);
    }
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
    try {
        // Handle special cases
        if (exponent === 0) return 1;
        if (exponent === 1) return base;
        if (base === 0) return 0;
        if (base === 1) return 1;
        
        // For other cases, use exp and log
        // This is faster than Math.pow for our precision needs
        return exp(exponent * Math.log(abs(base))) * 
            (base < 0 && exponent % 2 ? -1 : 1);

    } catch (e) {
        console.warn("[FastPow] Error: " + e);
        return Math.pow(base, exponent);
    }
}
export function log(x) {
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

export function atan2(y, x) {
    try {
        // Handle special cases
        if (x === 0) {
            if (y > 0) return PI / 2;
            if (y < 0) return -PI / 2;
            return 0;
        }

        const abs_y = abs(y);
        const abs_x = abs(x);
        const a = Math.min(abs_x, abs_y) / Math.max(abs_x, abs_y);
        
        // Approximation using polynomial
        const s = a * a;
        let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
        
        // Adjust for quadrant
        if (abs_y > abs_x) r = 1.57079637 - r;
        if (x < 0) r = PI - r;
        if (y < 0) r = -r;
        
        return r;
    } catch (e) {
        console.warn("[FastAtan2] Error: " + e);
        return Math.atan2(y, x);
    }
}
export function atan(x) {
    try {
        const abs_x = abs(x);
        const a = Math.min(abs_x, 1) / Math.max(abs_x, 1);
        
        // Approximation using polynomial
        const s = a * a;
        let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
        
        // Adjust if |x| > 1
        if (abs_x > 1) r = PI/2 - r;
        if (x < 0) r = -r;
        
        return r;
    } catch (e) {
        console.warn("[FastAtan] Error: " + e);
        return Math.atan(x);
    }
}

export function sin(x) {
    try {
        // Normalize angle to -π to π
        x = x % (2 * PI);
        if (x > PI) x -= 2 * PI;
        else if (x < -PI) x += 2 * PI;

        // Approximation: x - (x^3)/6 + (x^5)/120
        const x2 = x * x;
        return x * (1 - x2 / 6 + x2 * x2 / 120);
    } catch (e) {
        console.warn("[FastSin] Error: " + e);
        return Math.sin(x);
    }
}

export function cos(x) {
    try {
        // cos(x) = sin(x + π/2)
        return sin(x + Math.PI / 2);
    } catch (e) {
        console.warn("[FastCos] Error: " + e);
        return Math.cos(x);
    }
}

export function tan(x) {
    try {
        const sinX = sin(x);
        const cosX = cos(x);
        
        // Avoid division by zero
        if (cosX === 0) return Infinity;
        return sinX / cosX;
    } catch (e) {
        console.warn("[FastTan] Error: " + e);
        return Math.tan(x);
    }
}

export function pythag(a, b) {
    return sqrt(a ** 2 + b ** 2);
}

export function pytahg3d(a, b, c) {
    return sqrt(a ** 2 + b ** 2 + c ** 2);
}

export const PI = 3.14159;
