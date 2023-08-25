import * as Minecraft from "@minecraft/server";

// API sponsered by elon musk

// setTitle 
export function setTitle(player, title, subtitle) {
    player.runCommandAsync(`title "${player.name}" title ${title}`);
    player.runCommandAsync(`title "${player.name}" subtitle ${title}`);
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