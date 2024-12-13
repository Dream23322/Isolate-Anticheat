import * as Minecraft from "@minecraft/server";
/**
 * 
 * @param {Minecraft.player} player 
 * @param {*} lastPositions 
 * @param {*} otherData 
 */
export function mainPrediction(player, lastPositions, otherData) {
    //const possibleVelocities = getPosiblePositions(player, lastPositions, otherData);
    return;
}

function getPosiblePositions(player, lastPositions, otherData) {
    const velo = {x: player.velocity.x + otherData.velo.x / 2, y: player.velocity.y + otherData.velo.y / 2, z: player.velocity.z + otherData.velo.z / 2};
    
    // Get input vector 
    const inputVector = player.inputInfo.getMovementVector();

    // Get Yaw
    const yaw = player.getRotation().y; 
    return;
}