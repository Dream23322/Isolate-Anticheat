import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { angleCalc, getSpeed, getBlocksBetween } from "../../../utils/mathUtil.js";
import { add_effect } from "../../../utils/gameUtil.js";
import { fastPow, fastSqrt } from "../../../utils/fastMath.js";
export function nuker_d(player, block, brokenBlockId, resetValue) {
    // Check if the nukerD module is enabled and the broken block is a redstone ore
    if(config.modules.nukerD.enabled && (brokenBlockId === "minecraft:redstone_ore" || brokenBlockId === "minecraft:lit_redstone_ore")) {
        let score = 0; // Initialize the score

        // List directions we will be checking
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 }
        ];

        // Check each direction
        for (const dir of directions) {
            const pos = {
                x: block.location.x + dir.x,
                y: block.location.y + dir.y,
                z: block.location.z + dir.z
            };

            // If the position doesn't have air in it, add to the score
            if (getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
                score++;
            }    
        }

        let reset = false;

        // Check if the score is 6, if so, flag the player and reset the block
        if(score == 6) {
            flag(player, "Nuker", "D", "World", "score", score, true);
            reset = true;
        }

        // Calculate the distance between the player and the block
        const distance = fastSqrt(fastPow(block.location.x - player.location.x, 2) + fastPow(block.location.z - player.location.z, 2));

        // Check if the player is moving too fast and flag the player if true
        if(getSpeed(player) > 0.26) {
            flag(player, "Nuker", "D", "World", "Speed", getSpeed(player), true);
            reset = true;
        }

        // Check if the angle between the player and the block is greater than 90 degrees and flag the player if true
        if(angleCalc(player, block) > 90 && distance > 2) {
            flag(player, "Nuker", "D", "World", "angle", angleCalc(player, block), true);
            reset = true;
        }

        // Reset the block and add an absorption effect to the player if reset is true
        if(reset == true) {
            block.setPermutation(resetValue);
            add_effect(player, "minecraft:absorption", 1, 0);
        }
    }
}  
