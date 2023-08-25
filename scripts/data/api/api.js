import * as Minecraft from "@minecraft/server";

// API sponsered by elon musk
// This uses 1.81e-15 precision

// setTitle 
export function setTitle(player, title, subtitle) {
    player.runCommandAsync(`title "${player.name}" title ${title}`);
    player.runCommandAsync(`title "${player.name}" subtitle ${subtitle}`);
}

// kicks player
export function kickPlayer(player, reason) {
    player.runCommandAsync(`kick "${player.name}" ${reason}`);
}


// Gets player speed
export function getSpeed(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
    return playerSpeed;
}

// give a player a particle effect
export function setParticle(player, particleName) {
    player.runCommandAsync(`particle minecraft:${particleName} ~~~`);
}

// Check is a player is surrounded by air
export function aroundAir(player) {
    let isSurroundedByAir = true;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
                if (block.typeId !== "minecraft:air") {
                    isSurroundedByAir = false;
                    break;
                }
            }
        }
    }
    return isSurroundedByAir
}

// tellraw things
export function playerTellraw(player, message) {
    player.runCommandAsync(`tellraw "${player.name}" {"rawtext":[{"text":"${message}"}]}`);
}

// Gets the angle between the player's line of sight and the direction towards the object
export function angleCheck(player, object) {
    // Get the player's rotation
    const rotation = player.getRotation();
    const yaw = rotation.x; // Horizontal rotation (yaw) in radians
    const pitch = rotation.y; // Vertical rotation (pitch) in radians

    // Calculate the player's line of sight
    const playerSight = {
        x: Math.cos(pitch) * Math.sin(-yaw),
        y: Math.sin(pitch),
        z: -Math.cos(pitch) * Math.cos(-yaw)
    };

    // Calculate the direction towards the object
    const directionToObject = {
        x: object.location.x - player.location.x,
        y: object.location.y - player.location.y,
        z: object.location.z - player.location.z
    };

    // Normalize the direction vectors
    const playerSightNorm = Math.sqrt(playerSight.x**2 + playerSight.y**2 + playerSight.z**2);
    const directionToObjectNorm = Math.sqrt(directionToObject.x**2 + directionToObject.y**2 + directionToObject.z**2);

    // Calculate the dot product of the direction vectors
    const dotProduct = playerSight.x * directionToObject.x + playerSight.y * directionToObject.y + playerSight.z * directionToObject.z;

    // Calculate the angle between the direction vectors
    const angle = Math.acos(dotProduct / (playerSightNorm * directionToObjectNorm));

    // Convert the angle to degrees
    const angleInDegrees = angle * (180 / Math.PI);

    return angleInDegrees;
}

