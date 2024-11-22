const GRAVITY_THRESHOLD = 0.2; 
const GRAVITY_TOLERANCE = 0.05; 
const GRAVITY_ACCEL = -0.08; 
import { fastAbs } from "../../../../utils/fastMath.js";
import { fastPow } from "../../../../utils/fastMath.js";
import { inAir } from "../../../../utils/gameUtil.js";

/**
 * Check if player's Y-velocity is under the threshold.
 * @param {object} player - The player object containing velocity info.
 * @returns {boolean} - True if velocity is under threshold, false otherwise.
 */
export function isLowYVelocity(player, predY) {
    return fastAbs(player.location.y - predY) < GRAVITY_THRESHOLD;
}




/**
 * Check if player's Y-velocity follows expected patterns based on recent positions.
 * @param {object} player - The player object.
 * @param {Array} lastPositions - An array of the last 5 positions {x, y, z}.
 * @returns {boolean} - True if Y-velocity is normal, false otherwise.
 */
export function isYVelocityNormal(player, lastPositions) {
    if (lastPositions.length < 5) {
        console.warn("Not enough position data to predict velocity.");
        return true;
    }

    const velocities = [];
    for (let i = 0; i < lastPositions.length - 1; i++) {
        const deltaX = lastPositions[i].x - lastPositions[i + 1].x;
        const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
        const deltaZ = lastPositions[i].z - lastPositions[i + 1].z;

        velocities.push({
            deltaX,
            deltaY,
            deltaZ,
            magnitude: Math.sqrt(fastPow(deltaX, 2) + fastPow(deltaY, 2) + fastPow(deltaZ, 2)),
        });
    }

    const latestDeltaY = lastPositions[0].y - lastPositions[1].y;
    const expectedDeltaY = velocities[0].deltaY + GRAVITY_ACCEL;
    const deviation = fastAbs(latestDeltaY - expectedDeltaY);
    //console.warn(`Latest Y Delta: ${latestDeltaY.toFixed(3)}, Expected: ${expectedDeltaY.toFixed(3)}, Deviation: ${deviation.toFixed(3)}`);
    const DEVIATION_THRESHOLD = 0.1;
    const validY = deviation < DEVIATION_THRESHOLD;

    if (!validY) {
        console.warn(`Funky Y-velocity detected. Deviation: ${deviation}`);
    }

    return validY;
}

/**
 * Check if a players Y movements suggest that they are accelerating upwards while in air
 * @param {object} player - The player object.
 * @param {Array} lastPositions - An array of the last 5 positions {x, y, z}.
 * @returns {boolean} - True if the player is accelerating upwards, false otherwise.
 */
export function isAcceleratingUpwards(player, lastPositions) {
    if (lastPositions.length < 5) {
        console.warn("Not enough position data to predict velocity.");
        return true;
    }

    const oldestDeltaY = lastPositions[lastPositions.length - 1].y - lastPositions[lastPositions.length - 2].y;
    const olderDeltaY = lastPositions[lastPositions.length - 2].y - lastPositions[lastPositions.length - 3].y;
    const latestDeltaY = lastPositions[0].y - lastPositions[1].y;

    // Check if the player is accelerating upwards
    if(
        inAir(player) && 
        oldestDeltaY < olderDeltaY &&
        fastAbs(oldestDeltaY - olderDeltaY) > 0.7 &&
        olderDeltaY < latestDeltaY &&
        fastAbs(olderDeltaY - latestDeltaY) > 0.8
    ) return true;

    return false;
}