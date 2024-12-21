import config from "../../../../data/config.js";
import { getScore } from "../../../../util.js";
import * as isomath from "../../../../utils/maths/isomath.js";

// This is based off code by ethaniccc
// It can be found at:
// https://github.com/ethaniccc/Esoteric/blob/master/src/ethaniccc/Esoteric/check/movement/motion/MotionB.php


export function offGroundFriction(player, lastPositions) {
    if(player.ticksOffGround < config.modules.predictionA.minOffGroundTicksOGF) {
        if(player.ticksOffGround > 0 && player.hasTag("ogf_debug_2")) player.sendMessage("Close")
        return {flag: false, data: null};
    }

    const jumpMovementFactor = player.isSprinting ? 0.026 : 0.02;

    const lastMoveDelta = {x: lastPositions[2].x - lastPositions[1].x, y: lastPositions[2].y - lastPositions[1].y, z: lastPositions[2].z - lastPositions[1].z};
    const currentMoveDelta = {x: lastPositions[1].x - lastPositions[0].x, y: lastPositions[1].y - lastPositions[0].y, z: lastPositions[1].z - lastPositions[0].z};

    const currentXZ = isomath.pythag(currentMoveDelta.x, currentMoveDelta.z);
    const lastXZ = isomath.pythag(lastMoveDelta.x, lastMoveDelta.z);

    let prediction = lastXZ * 0.91 + jumpMovementFactor;

    const diff = currentXZ - prediction;

    if(player.ticksSinceJump <= 1) prediction += 0.3;
    if(player.hasTag("ogf_debug")) player.sendMessage(`§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> Prediction: §b${prediction} | Diff: §b${diff} | OGTICKS: ${player.ticksOffGround}`);
    if(currentXZ > 0 && lastXZ > 0 && diff > config.modules.predictionA.deviationOGF) return {flag: true, data: [prediction, diff]};
    
    return {flag: false, data: null};
}