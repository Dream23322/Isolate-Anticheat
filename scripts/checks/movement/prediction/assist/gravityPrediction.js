const GRAVITY_ACCEL = -0.08; 
import { getScore } from "../../../../util.js";
import { fastAbs, fastSqrt } from "../../../../utils/maths/fastMath.js";
import { fastPow } from "../../../../utils/maths/fastMath.js";
import { inAir } from "../../../../utils/gameUtil.js";
import { getAverage } from "../../../../utils/maths/mathUtil.js";
import * as isomath from "../../../../utils/maths/isomath.js";
/**
 * Check if player's Y-velocity follows expected patterns based on recent positions.
 * @param {object} player - The player object.
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
 * @param {object} player - The player object.
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

export function gravityCheck(lastPositions, player) {
    // Confirm that all lastPositions are inAir
    for (const posDat of lastPositions) {
        if(posDat.inair !== true) {
            if(player.hasTag("invalidA")) player.sendMessage("invalidA");
            return {x: false, y: null};
        }
    }

    let skip_check_one = false;

    // Confirm that the player hasn't jumped/acceled upwards
    // To do this, we compare two position points that are next to each other and if the player has moved up, skip
    for (let i = 0; i < lastPositions.length - 1; i++) {
        const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
        if (player.hasTag("gravityA")) player.sendMessage("deltaY: " + deltaY);
        if (deltaY >= 0) skip_check_one = true;
    }

    if (!skip_check_one) {
        // This checks if the players downwards acceleration seems legitimate
        const min_down_accel = -0.00655 * getScore(player, "airTime", 0);

        for (let i = 0; i < lastPositions.length - 1; i++) {
            const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
            // If the players fall rate isnt fast enough, return true and flag
            if(player.hasTag("gravityB")) player.sendMessage("2deltaY: " + deltaY);
            if (deltaY > min_down_accel) return {
                x: true, 
                y: "BadAccel.Type:Down, Data: " + 
                deltaY.toFixed(6) + 
                ", " + 
                min_down_accel.toFixed(5)
            };
        }
    }

    let lastDelta = 0;
    // Checks if the player was going down then began to come back up
    for (let i = 0; i < lastPositions.length - 1; i++) {
        const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
        if(player.hasTag("gravityC")) player.sendMessage("3deltaY: " + deltaY + " lastDelta: " + lastDelta);
        if(deltaY < 0 && lastDelta > 1e-4) return {x: true, y: "BadAccel.Type:Reverse, Data: " + deltaY.toFixed(4) +  ", " + lastDelta.toFixed(4)};
        lastDelta = deltaY;
    }

    // Checks for accel upwards or constant upwards Y movement
    lastDelta = 0;
    if(skip_check_one) {
        for (let i = 0; i < lastPositions.length - 1; i++) {
            const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
            if(player.hasTag("gravityD")) player.sendMessage("4deltaY: " + deltaY + " lastDelta: " + lastDelta);
            // If the player isnt decellerating, return true as this is impossible mid air (y movement only)
            if(deltaY >= lastDelta && lastDelta > 0.003 && deltaY > 0 && getScore(player, "airTime", 0) > 8) return {x: true, y: "BadAccel.Type:Upwards, Data: " + deltaY.toFixed(4) +  ", " + lastDelta.toFixed(4)};
            lastDelta = deltaY;
        }
    }
    return {x: false};
}