const GRAVITY_ACCEL = -0.08; 
import { getScore } from "../../../../util.js";
import { inAir } from "../../../../utils/gameUtil.js";
import { getAverage } from "../../../../utils/maths/mathUtil.js";
import * as isomath from "../../../../utils/maths/isomath.js";
import { Player } from "@minecraft/server";
/**
 * Check if player's Y-velocity follows expected patterns based on recent positions.
 * @param {Player} player - The player object.
 * @param {Array} lastPositions - An array of the last 5 positions {x, y, z}.
 * @returns {boolean} - True if Y-velocity is normal, false otherwise.
 */
export function isYVelocityNormal(player, lastPositions) {
    if (lastPositions.length < 5) {
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
            magnitude: isomath.sqrt(isomath.pow(deltaX, 2) + isomath.pow(deltaY, 2) + isomath.pow(deltaZ, 2)),
        });
    }

    const latestDeltaY = lastPositions[0].y - lastPositions[1].y;
    const expectedDeltaY = velocities[0].deltaY + GRAVITY_ACCEL;
    const deviation = isomath.abs(latestDeltaY - expectedDeltaY);
    const DEVIATION_THRESHOLD = 0.1;
    const validY = deviation < DEVIATION_THRESHOLD;


    return validY;
}

/**
 * Check if a players Y movements suggest that they are accelerating upwards while in air
 * @param {Player} player - The player object.
 * @param {Array} lastPositions - An array of the last 5 positions {x, y, z}.
 * @returns {boolean} - True if the player is accelerating upwards, false otherwise.
 */
export function isAcceleratingUpwards(player, lastPositions) {
    if (lastPositions.length < 5) {
        return true;
    }

    const oldestDeltaY = lastPositions[lastPositions.length - 1].y - lastPositions[lastPositions.length - 2].y;
    const olderDeltaY = lastPositions[lastPositions.length - 2].y - lastPositions[lastPositions.length - 3].y;
    const latestDeltaY = lastPositions[0].y - lastPositions[1].y;

    if(
        inAir(player) && 
        oldestDeltaY < olderDeltaY &&
        isomath.abs(oldestDeltaY - olderDeltaY) > 0.7 &&
        olderDeltaY < latestDeltaY &&
        isomath.abs(olderDeltaY - latestDeltaY) > 0.8
    ) return true;

    return false;
}

/**
 * 
 * @param {*} lastPositions 
 * @param {Player} player 
 * @returns 
 */
export function gravityCheck(lastPositions, player) {
    // Early return if any position is not in air
    if (!lastPositions.every(pos => pos.inair === true)) {
        return { x: false, y: null };
    }

    const airTime = getScore(player, "airTime", 0);
    const min_down_accel = -0.00655 * airTime;
    let hasUpwardMovement = false;
    let lastDelta = 0;

    // Loop through all the data
    for (let i = 0; i < lastPositions.length - 1; i++) {
        const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
        
        // Check for upward movement
        if (deltaY >= 0) hasUpwardMovement = true;
    
        // Check downward acceleration if no upward movement
        if (!hasUpwardMovement && deltaY > min_down_accel) {
            return { x: true, y: `BadAccel.Type:Down, Data: ${deltaY.toFixed(6)}, ${min_down_accel.toFixed(5)}` };
        }
        // Check reverse movement
        if (deltaY < 0 && lastDelta > 1e-4) {
            return { x: true, y: `BadAccel.Type:Reverse, Data: ${deltaY.toFixed(4)}, ${lastDelta.toFixed(4)}` };
        }
        // Check upward acceleration
        if (hasUpwardMovement && deltaY >= lastDelta && 
            lastDelta > 0.003 && deltaY > 0 && airTime > 8) {
            return { x: true, y: `BadAccel.Type:Upwards, Data: ${deltaY.toFixed(4)}, ${lastDelta.toFixed(4)}`};
        }
        lastDelta = deltaY;
    }

    return { x: false };
}