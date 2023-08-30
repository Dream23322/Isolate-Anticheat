import * as Minecraft from "@minecraft/server";

// API sponsered by elon musk
// This uses 1.81e-15 precision

// ©️ Isolate Anticheat - API system

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

/**
 * @name aroundAir - Returns true if a player is surround by air (Paradox Anticheat Code)
 * @param {object} player - The player that you are checking
 * @example if(aroundAir(player)) flag(player, "Movement', "A")
 * @remarks Flags for Movement/A if a player is surrounded by air
 */
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

/**
 * @name playerTellraw - easy tellraw command
 * @param {object} player - The player you want to use the tellraw message on
 * @param {string} message - The message the player will be told
 */
export function playerTellraw(player, message) {
    player.runCommandAsync(`tellraw "${player.name}" {"rawtext":[{"text":"${message}"}]}`);
}


/**
 * @name isAttackingFromOutsideView - Returns true if a player attacks outside of a specified angle
 * @param {object} player1  - The attacking player
 * @param {object} player2  - The entity that was attacked
 * @param {int} angle - The angle that the function is looking for
 * @example isAttackingFromOutsideView(player, entity, 90)
 * @remarks returns true if the attacked entity isnt inside of a 90 degree range on the attacking entities screen
 */
export function isAttackingFromOutsideView(player1, player2, angle) {
    if (!player1 || !player2) {
        return false; // Invalid player objects
    }

    // Calculate the distance between the two players
    const distance = Math.sqrt(Math.pow(player2.location.x - player1.location.x, 2) + Math.pow(player2.location.y - player1.location.y, 2) + Math.pow(player2.location.z - player1.location.z, 2));

    // Check if the distance is greater than or equal to 2 blocks
    if (distance >= 2) {
        // Get the view direction vector of player1
        const player1ViewDir = player1.getViewDirection();

        // Calculate the vector from player1 to player2
        const player1ToPlayer2 = {
            x: player2.location.x - player1.location.x,
            y: player2.location.y - player1.location.y,
            z: player2.location.z - player1.location.z,
        };

        // Calculate the dot product
        const dotProduct2 = player1ViewDir.x * player1ToPlayer2.x + player1ViewDir.y * player1ToPlayer2.y + player1ViewDir.z * player1ToPlayer2.z;

        // Calculate the magnitude of the vector
        const player1ToPlayer2Magnitude = Math.sqrt(player1ToPlayer2.x * player1ToPlayer2.x + player1ToPlayer2.y * player1ToPlayer2.y + player1ToPlayer2.z * player1ToPlayer2.z);

        // Normalize the dot product
        const normalizedDotProduct2 = dotProduct2 / (player1ToPlayer2Magnitude * Math.sqrt(player1ViewDir.x * player1ViewDir.x + player1ViewDir.y * player1ViewDir.y + player1ViewDir.z * player1ViewDir.z));

        // Convert dot product to angle in degrees
        const angle2 = Math.acos(normalizedDotProduct2) * (180 / Math.PI);

        // Check if angle2 is greater than 90 degrees
        return angle2 > angle;
    }

    return false;
}


export function getHealth(player) {
    const healthComponent = player.getComponent("minecraft:health");
    return healthComponent;
}