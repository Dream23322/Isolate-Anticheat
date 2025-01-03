import { getScore } from "../../../../util.js";
import { inAir } from "../../../../utils/gameUtil.js";
import { getAverage } from "../../../../utils/maths/mathUtil.js";
import * as isomath from "../../../../utils/maths/isomath.js";
import { Player } from "@minecraft/server";

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