import { getBlocksBetween } from "./mathUtil";

// setTitle 
export function setTitle(player, title, subtitle) {
    player.runCommandAsync(`title "${player.name}" title ${title}`);
    player.runCommandAsync(`title "${player.name}" subtitle ${subtitle}`);
}

// kicks player
export function kickPlayer(player, reason) {
    player.runCommandAsync(`kick "${player.name}" ${reason}`);
}




// give a player a particle effect
export function setParticle(player, particleName) {
    player.runCommandAsync(`particle minecraft:${particleName} ~~~`);
}

// Add Tags 
export function tag_system(player) {
    player.runCommandAsync(`tag @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] add ender_pearl`);
}

// Give a player an ingame effect
export function add_effect(player, effectName, value1, value2) {
    player.runCommandAsync(`effect ${player.name} ${effectName} ${value1} ${value2}`);
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


/**
 * @name inAir - Returns true if a player is in air (Paradox Anticheat Code)
 * @param {object} player - The player that you are checking
 * @example if(inAir(player)) flag(player, "Movement', "A")
 * @remarks Flags for Movement/A if a player is in air
 */
export function inAir(player) {
    let isInAir = true;
    for (let y = 0; y < 1.8; y += 0.1) {
        const block = player.dimension.getBlock({ x: player.location.x, y: player.location.y + y, z: player.location.z });
        if (block.typeId !== "minecraft:air") {
            isInAir = false;
            break;
        }
    }
    return isInAir;
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




export function getHealth(player) {
    const healthComponent = player.getComponent("minecraft:health");
    return healthComponent;
}


/**
 * @name setSound - Plays a sound for the world to hear
 * @param {object} player - The player running the sound function
 * @param {string} id - The id of the played sound
 * @example setSound(player, "mob.goat.death.screamer");
 * @remarks That sound will play for everyone
 */
export function setSound(player, id) {
    player.runCommandAsync(`playsound ${id} @a`);
}


/**
 *  @name getBlock_one - Gets the block type in one position
 *  @param {object} pos - The player running the function
 *  @example getBlock_one({x: 10, y: 10, z: 10});
 *  @remarks Gets the block type in one position
 */
export function getBlock_one(pos) {
    return player.dimension.getBlock(pos);
}

/**
 *  @name getBlock_two - Gets the block type between two positions
 *  @param {object} pos - The player running the function
 *  @example getBlock_two({x: 10, y: 10, z: 10}, {x: 10, y: 10, z: 10});
 *  @remarks Gets the block type in two positions
 */
export function getBlock_two(pos1, pos2) {
    return getBlocksBetween(pos1, pos2).some((blk) => player.dimension.getBlock(blk)?.typeId);
}