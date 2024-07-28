// Gets player speed
export function getSpeed(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
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
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: entityHit.location.x, y: entityHit.location.y, z: entityHit.location.z };
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle); 
    return angle;
}

/**
 * @name hVelocity
 * @remarks Calculates a players horizontal velocity
 */
export function hVelocity(player) {
    return (player.getVelocity().x + player.getVelocity().z) / 2
}

export function hVelocity_2(player) {
    return Math.abs(player.getVelocity().x - player.getVelocity().z);
}

export function angleCalcRecode(player, entityHit) {
    const deltaX = entityHit.location.x - player.location.x;
    const deltaZ = entityHit.location.z - player.location.z;

    // Calculate the angle in radians
    let angleRad = Math.atan2(deltaZ, deltaX);

    // Convert radians to degrees
    let angleDeg = (angleRad * 180) / Math.PI;

    // Adjust for player rotation
    angleDeg -= player.getRotation().y + 90;

    // Normalize the angle to be between 0 and 360 degrees
    if (angleDeg < 0) {
        angleDeg += 360;
    }

    return angleDeg;
}


export function getDistanceXZ(one, two) {
    return Math.sqrt(Math.pow(two.location.x - one.location.x, 2) + Math.pow(two.location.z - one.location.z, 2));
}
export function getDistanceXYZ(one, two) {
    return Math.sqrt(Math.pow(two.location.x - one.location.x, 2) + Math.pow(two.location.y - one.location.y, 2) + Math.pow(two.location.z - one.location.z, 2));
}
export function getDistanceY(one, two) {
    return Math.sqrt(Math.pow(two.location.y - one.location.y, 2));
}
export function getAbsoluteGcd(current, last) {
    const EXPANDER = 1.6777216E7; // Adjusted to the provided value

    let currentExpanded = Math.floor(current * EXPANDER);
    let lastExpanded = Math.floor(last * EXPANDER);

    return gcd(currentExpanded, lastExpanded);
}

export function gcd(a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
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
        variance += Math.pow(number - average, 2.0);
    });

    return variance;
}

export function getStandardDeviation(data) {
    const variance = getVariance(data);
    return Math.sqrt(variance);
}

export function isScientificNotation(num) {
    return num.toString().includes("E");
}

export function mathOnGround(posY) {
    return posY % 0.015625 === 0;
}

export function getOutliers(collection, amt=1.5) {
    const values = Array.from(collection);
    const half = Math.floor(values.length / 2);
    const q1 = getMedian(values.slice(0, half));
    const q3 = getMedian(values.slice(half, values.length));
    const iqr = Math.abs(q1 - q3);
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
    const median = (count % 2 !== 0) ? numbers[Math.floor(count / 2)] : (numbers[count / 2 - 1] + numbers[count / 2]) / 2;
    const variance = getVariance(data);

    return 3 * (mean - median) / Math.sqrt(variance);
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
    const efficiencySecond = 3 * Math.pow(count - 1, 2) / ((count - 2) * (count - 3));
    const average = sum / count;

    let variance = 0.0;
    let varianceSquared = 0.0;

    data.forEach(number => {
        variance += Math.pow(average - number, 2.0);
        varianceSquared += Math.pow(average - number, 4.0);
    });

    return efficiencyFirst * (varianceSquared / Math.pow(variance / sum, 2.0)) - efficiencySecond;
}

/**
 * Calculates the median value of an array of numbers.
 *
 * @param {number[]} values - The array of numbers to calculate the median for.
 * @return {number} The median value of the input array.
 */
export function getMedian(values) {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
        return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
    } else {
        return sortedValues[middleIndex];
    }
}
