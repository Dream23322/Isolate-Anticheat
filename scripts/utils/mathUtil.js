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
