import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

/*
Original Code from 4urxra
Recode (cleaner) from VIsual1mpact
https://github.com/Visual1mpact/
Then I found false flags in it and made it messy again lmao
*/
export function nuker_c(player, block, blockBreak, Minecraft) {
    if(!allowedPlatform(player, config.modules.nukerC.AP)) return;
    if(config.modules.nukerC.enabled) {
        let score = 0;
        // List directions we will be checking
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 }
        ];
        // Check each direction
        for (const dir of directions) {
            // Make the position to check
            const pos = {
                x: block.location.x + dir.x,
                y: block.location.y + dir.y,
                z: block.location.z + dir.z
            };
            // If the position doesnt have air in it, add to the score
            if (!getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
                score++;
            }
            // If the position does have a minecraft bed in it, check around that area
            if(getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:bed")) {
                let score2 = 0;
                for (const dir of directions) {
                    const newPos = {
                        x: pos.x + dir.x,
                        y: pos.y + dir.y,
                        z: pos.z + dir.z                    
                    };
                    // If a spot has air, its all good
                    if(getBlocksBetween(newPos, newPos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:air")) {
                        score2++;
                    }
                }
                // if a spot doesnt have air, issue.
                if(score2 === 0) {
                    score--;
                }
            }
        }
        // If the socre comes out to -1, it means that the bed is surrounded by blocks, so flag.
        if (score === config.modules.nukerC.score && block.typeId === "minecraft:bed") {
            blockBreak.cancel;
            // Run the flag in system.run because this function runs in a before event so the flag will return an error at line 194.
            // This happens because we can't change player data in a before events.
            Minecraft.system.run(() => {
                flag(player, "Nuker", "C", "World", "score", score, false);
            });
            blockBreak.cancel;
        }
    }
}