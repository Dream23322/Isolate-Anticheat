import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";
/**
 * Checks if a player is breaking a bed at an angle greater than 90 degrees
 * and the distance between the player and the bed is greater than 1.5 blocks.
 * If the conditions are met, flags the player with the Nuker B module.
 *
 * @param {Minecraft.Player} player - The player who broke the block
 * @param {Minecraft.Block} block - The block that was broken
 * @param {string} brokenBlockId - The ID of the broken block
 */
export function nuker_b(player, block, brokenBlockId) {
    // Check if the nukerB module is enabled
    if(config.modules.nukerB.enabled) {
        // Calculate the angle between the player and the block
        const angle = angleCalc(player, block);

        // Check if the angle is greater than 90 degrees
        if(angle > 90) {
            // Calculate the distance between the player and the block
            const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) +
                                       Math.pow(block.location.z - player.location.z, 2));

            // Check if the broken block is a bed and the distance is greater than 1.5 blocks
            if(brokenBlockId === "minecraft:bed" && distance > 1.5) {
                // Flag the player with the Nuker B module
                flag(player, "Nuker", "B", "World", "angle", angle);
            }
        }
    }
}

