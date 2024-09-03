import { fastAbs, fastAtan2, fastFloor, fastPow, fastSqrt, PI } from "./fastMath";

// Gets player speed
export function getSpeed(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = Number(fastSqrt(fastAbs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
    return playerSpeed;
}

/**
 * @name getBlocksBetween
 * @remarks Find every possible coordinate between two sets of Vector3's
 * @param {object} pos1 - First set of coordinates
 * @param {object} pos2 - Second set of coordinates
 * @returns {Array} coordinates - Each possible coordinate
 */
export function getBlocksBetween(pos1, pos2) {
    const { x: minX, y: minY, z: minZ} = pos1;
    const { x: maxX, y: maxY, z: maxZ} = pos2;

    const coordinates = [];

    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            for(let z = minZ; z <= maxZ; z++) {
                coordinates.push({x, y, z});
            }
        }
    }

    return coordinates;
}
/**
 * @name angleMaths
 */
export function angleCalc(player, entityHit) {
    const dx = entityHit.location.x - player.location.x;
    const dz = entityHit.location.z - player.location.z;
    const angleToEntity = fastAtan2(dz, dx) * 180 / PI;
    let angle = angleToEntity - player.getRotation().y - 90;
    
    if (angle <= -180) {
        angle += 360;
    }
    
    return fastAbs(angle);
}

/**
 * @name hVelocity
 * @remarks Calculates a players horizontal velocity
 */
export function hVelocity(player) {
    return (player.getVelocity().x + player.getVelocity().z) / 2
}

export function hVelocity_2(player) {
    return fastAbs(player.getVelocity().x - player.getVelocity().z);
}

export function angleCalcRecode(player, entityHit) {
    const deltaX = entityHit.location.x - player.location.x;
    const deltaZ = entityHit.location.z - player.location.z;

    // Calculate the angle in radians
    let angleRad = fastAtan2(deltaZ, deltaX);

    // Convert radians to degrees
    let angleDeg = (angleRad * 180) / PI;

    // Adjust for player rotation
    angleDeg -= player.getRotation().y + 90;

    // Normalize the angle to be between 0 and 360 degrees
    if (angleDeg < 0) {
        angleDeg += 360;
    }

    return angleDeg;
}


export function getDistanceXZ(one, two) {
    return fastSqrt(fastPow(two.location.x - one.location.x, 2) + fastPow(two.location.z - one.location.z, 2));
}
export function getDistanceXYZ(one, two) {
    return fastSqrt(fastPow(two.location.x - one.location.x, 2) + fastPow(two.location.y - one.location.y, 2) + fastPow(two.location.z - one.location.z, 2));
}
export function getDistanceY(one, two) {
    return fastSqrt(fastPow(two.location.y - one.location.y, 2));
}
export function getAbsoluteGcd(current, last) {
    const EXPANDER = 1.6777216E7; // Adjusted to the provided value

    let currentExpanded = fastFloor(current * EXPANDER);
    let lastExpanded = fastFloor(last * EXPANDER);

    return gcd(currentExpanded, lastExpanded);
}

export function gcd(a, b) {
    if (a < b) {
        return gcd(b, a);
    }
    if (fastAbs(b) < 0.001) {
        return a;
    } else {
        return gcd(b, a - fastFloor(a / b) * b);
    }
}

export function getGcdInt(current, previous) {
    return (previous <= 16384) ? current : getGcd(previous, current % previous);
}
export function getGcdFloat(a, b) {
    if (a < b) {
        return getGcd(b, a);
    }

    if (fastAbs(b) < 0.001) {
        return a;
    } else {
        return getGcd(b, a - fastFloor(a / b) * b);
    }
}
export const EXPANDER = Math.pow(2, 24);

export function getVariance(data) {
    let count = 0;
    let sum = 0.0;
    let variance = 0.0;
    let average;

    data.forEach(number => {
        sum += number;
        ++count;
    });

    average = sum / count;

    data.forEach(number => {
        variance += fastPow(number - average, 2.0);
    });

    return variance;
}

export function getStandardDeviation(data) {
    const variance = getVariance(data);
    return fastSqrt(variance);
}

export function isScientificNotation(num) {
    return num.toString().includes("E");
}

export function mathOnGround(posY) {
    return posY % 0.015625 === 0;
}

export function getOutliers(collection, amt=1.5) {
    const values = Array.from(collection);
    const half = fastFloor(values.length / 2);
    const q1 = getMedian(values.slice(0, half));
    const q3 = getMedian(values.slice(half, values.length));
    const iqr = fastAbs(q1 - q3);
    const lowThreshold = q1 - amt * iqr;
    const highThreshold = q3 + amt * iqr;
    const outliers = {
        lower: [],
        upper: []
    };

    values.forEach(value => {
        if (value < lowThreshold) {
            outliers.lower.push(value);
        } else if (value > highThreshold) {
            outliers.upper.push(value);
        }
    });

    return outliers;
}

export function getOutliersInt(collection, amt=1.5) {
    const data = getOutliers(collection, amt);
    // Return amount of outliers
    return data.lower.length + data.upper.length;
}

export function getSkewness(data) {
    let sum = 0;
    let count = 0;
    const numbers = Array.from(data);

    numbers.forEach(number => {
        sum += number;
        ++count;
    });

    numbers.sort((a, b) => a - b);

    const mean = sum / count;
    const median = (count % 2 !== 0) ? numbers[fastFloor(count / 2)] : (numbers[count / 2 - 1] + numbers[count / 2]) / 2;
    const variance = getVariance(data);

    return 3 * (mean - median) / fastSqrt(variance);
}

export function getAverage(data) {
    return data.reduce((acc, val) => acc + val, 0) / data.length;
}

export function getKurtosis(data) {
    let sum = 0.0;
    let count = 0;

    data.forEach(number => {
        sum += number;
        ++count;
    });

    if (count < 3) {
        return 0.0;
    }

    const efficiencyFirst = count * (count + 1) / ((count - 1) * (count - 2) * (count - 3));
    const efficiencySecond = 3 * fastPow(count - 1, 2) / ((count - 2) * (count - 3));
    const average = sum / count;

    let variance = 0.0;
    let varianceSquared = 0.0;

    data.forEach(number => {
        variance += fastPow(average - number, 2.0);
        varianceSquared += fastPow(average - number, 4.0);
    });

    return efficiencyFirst * (varianceSquared / fastPow(variance / sum, 2.0)) - efficiencySecond;
}

/**
 * Calculates the median value of an array of numbers.
 *
 * @param {number[]} values - The array of numbers to calculate the median for.
 * @return {number} The median value of the input array.
 */
export function getMedian(values) {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const middleIndex = fastFloor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
        return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
    } else {
        return sortedValues[middleIndex];
    }
}


export function arrayToList(arr) {
    const list = []
    
    for (const item of arr) {
      list.push(item);
    }
    
    return list;
}

export function isWavePattern(arr) {
    if (arr.length < 3) return false;
    
    let increasing = arr[1] > arr[0];
    
    for (let i = 2; i < arr.length; i++) {
      if (increasing) {
        if (arr[i] <= arr[i-1]) {
          increasing = false;
        }
      } else {
        if (arr[i] >= arr[i-1]) {
          if (i === arr.length - 1) return false;
          increasing = true;
        }
      }
    }
    
    return !increasing;
}

export function getAverageDifference(arr) {
    let sum = 0;
    for (let i = 1, len = arr.length; i < len; i++) {
        sum += arr[i] - arr[i - 1];
    }
    return sum / (len - 1);
}


export function getListDifferences(values) {
    return values.slice(0, -1).map((value, index) => value - values[index + 1]);
}

export function isNearPerfectWave(arr, tolerance = 0.1) {
    if (arr.length < 3) return false;
    
    let increasing = arr[1] > arr[0];
    let prevDiff = fastAbs(arr[1] - arr[0]);
    
    for (let i = 2; i < arr.length; i++) {
      let diff = fastAbs(arr[i] - arr[i-1]);
      let diffRatio = fastAbs(diff - prevDiff) / prevDiff;
      
      if (increasing) {
        if (arr[i] <= arr[i-1] || diffRatio > tolerance) {
          if (i === arr.length - 1) return false;
          increasing = false;
        }
      } else {
        if (arr[i] >= arr[i-1] || diffRatio > tolerance) {
          if (i === arr.length - 1) return false;
          increasing = true;
        }
      }
      
      prevDiff = diff;
    }
    
    return !increasing;
  }

export function isPerfectWave(arr) {
    if (arr.length < 4) return false;

    let peak = fastFloor(arr.length / 2);

    // Check if the array is increasing up to the peak
    for (let i = 1; i <= peak; i++) {
        if (arr[i] <= arr[i-1]) return false;
    }

    // Check if the array is decreasing after the peak
    for (let i = peak + 1; i < arr.length; i++) {
        if (arr[i] >= arr[i-1]) return false;
    }

    return true;
}


export function countDuplicates(list) {
    const counts = {};
    let duplicateCount = 0;
  
    for (const item of list) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] === 2) {
        duplicateCount++;
      }
    }
  
    return duplicateCount;
  }

export function getgcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}


export function getStandardDeviationV2(numbers) {
    const n = numbers.length;
    if (n === 0) return 0;

    let sum = 0;
    let sumSqr = 0;
    
    for (const num of numbers) {
        sum += num;
        sumSqr += num * num;
    }

    const mean = sum / n;
    const variance = (sumSqr - sum * mean) / (n - 1);
    
    return fastSqrt(variance);
}


export function findNearDuplicates(arr) {
    const floatMap = new Map();
    let duplicateCount = 0;

    arr.forEach(num => {
        // To handle precision issues, round the float to a fixed number of decimal places
        const roundedNum = num.toFixed(10);

        if (floatMap.has(roundedNum)) {
            if (floatMap.get(roundedNum) === 1) {
                duplicateCount++;
            }
            floatMap.set(roundedNum, floatMap.get(roundedNum) + 1);
        } else {
            floatMap.set(roundedNum, 1);
        }
    });

    return duplicateCount;
}

export function countRoundedValues(arr) {
    let flatCount = 0;

    arr.forEach(num => {
        // Check if the number is an integer (flat/round value)
        if (Number.isInteger(num)) {
            flatCount++;
        }
    });

    return flatCount;
}