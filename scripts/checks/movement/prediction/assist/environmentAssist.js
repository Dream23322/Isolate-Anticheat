export function envrionmentAssist(player, xPart, yPart, zPart, environmentData) {
    let envrionmentAssist = { x: xPart, y: yPart, z: zPart };

    // Handle player sneaking
    const sneakingHandled = handleSneaking(player, xPart, zPart, environmentData);

    envrionmentAssist.x = sneakingHandled.x;
    envrionmentAssist.z = sneakingHandled.z;


    return envrionmentAssist;
}

function handleSneaking(player, xPart, zPart, environmentData) {
    return environmentData.sneak ? { x: xPart * 0.3, z: zPart * 0.3 } : { x: xPart, z: zPart };
}