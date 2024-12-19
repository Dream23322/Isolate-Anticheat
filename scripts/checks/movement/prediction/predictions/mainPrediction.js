import * as Minecraft from "@minecraft/server";
import * as isomath from "../../../../utils/maths/isomath.js";
/**
 * 
 * @param {Minecraft.Player} player 
 * @param {*} lastPositions 
 * @param {*} otherData 
 */
export function mainPrediction(player, lastPositions, otherData) {
    const basicPredictionPositions = doPrediction(player, lastPositions[1], otherData);
    
    const deviation = isomath.pythag(
        player.location.x - basicPredictionPositions.x,
        player.location.z - basicPredictionPositions.z
    )

    // Debug
    if(player.hasTag("main_debug")) player.sendMessage(`§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> Prediction: §b${deviation}`);
    return {dev: deviation, pos: {x: basicPredictionPositions.x, z: basicPredictionPositions.z}, velo: otherData.velo};
}

/**
 * 
 * @param {Minecraft.Player} player 
 * @param {*} lastPosition 
 */
export function doPrediction(player, lastPosition, otherData) {
    const predictedVelocity = doVelocityPrediction(player, lastPosition, otherData);

    const predictedX = lastPosition.x + predictedVelocity.x;
    const predictedZ = lastPosition.z + predictedVelocity.z;

    if(player.hasTag("debug_prediction")) player.runCommandAsync(`particle minecraft:blue_flame_particle ${predictedX} ${player.location.y} ${predictedZ}`);
    if(player.hasTag("debug_velo")) player.sendMessage("Velocity: " + predictedVelocity.x + ", " + predictedVelocity.z + " Actual: " + player.getVelocity().x + ", " + player.getVelocity().z);
    return {x: predictedX, z: predictedZ, vx: predictedVelocity.x, vz: predictedVelocity.z};
}

// TODO: Account for Jummping in a better way
// TODO: Account for sprinting in a different way
// TODO: (Major) Account for key-presses
// TODO: Knockback prediciton?

/**
 * 
 * @param {Minecraft.Player} player 
 * @param {*} lastPositions 
 * @param {*} otherData 
 */
function doVelocityPrediction(player, lastPositions, otherData) {
    
    let friction = player.ticksOffGround > 1 ? 0.91 : 0.98;

    let jumpMovementFactor = player.ticksOffGround < 2 ? 0 : player.isSprinting ? 0.026 : 0.02;

    const lastVelo = otherData.velo;
    const predictedX = lastVelo.x * friction;
    const predictedZ = lastVelo.z * friction;

    return {x: predictedX, z: predictedZ};
}
