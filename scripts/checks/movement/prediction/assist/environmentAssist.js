export function envrionmentAssist(player, xPart, zPart, environmentData) {
    let envrionmentAssist = { x: xPart, z: zPart };

    // Handle player sneaking
    const sneakingHandled = handleSneaking(player, xPart, zPart, environmentData);

    envrionmentAssist.x = sneakingHandled.x;
    envrionmentAssist.z = sneakingHandled.z;

    // Handle Ground Friction
    const frictionHandled = handleFriction(player, envrionmentAssist.x, envrionmentAssist.z, environmentData);

    envrionmentAssist.x = frictionHandled.x;
    envrionmentAssist.z = frictionHandled.z;

    return envrionmentAssist;
}

function handleSneaking(player, xPart, zPart, environmentData) {
    return environmentData.sneak ? { x: xPart * 0.3, z: zPart * 0.3 } : { x: xPart, z: zPart };
}

function handleFriction(player, xPart, zPart, environmentData) {
    return player.isOnGround && 
        environmentData.ground ? { x: xPart * 0.98, z: zPart * 0.98 } : { x: xPart, z: zPart };
}
