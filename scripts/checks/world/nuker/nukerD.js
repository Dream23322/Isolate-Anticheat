import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { angleCalc, angleCalcRecode, getSpeed } from "../../../utils/mathUtil.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";
/*
Different style nuker checks
*/
export function nuker_d(player, block, brokenBlockId, resetValue) {
    if(config.modules.nukerD.enabled && (brokenBlockId === "minecraft:redstone_ore" || brokenBlockId === "minecraft:lit_redstone_ore")) {
        let score = 0;
        // List directions we will be checking
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 }
        ];
        for (const dir of directions) {
            const pos = {
                x: block.location.x + dir.x,
                y: block.location.y + dir.y,
                z: block.location.z + dir.z
            };
            // If the position doesnt have air in it, add to the score
            if (getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
                score++;
            }     
        }   
        let reset = false;
        console.warn(`${player.name} Score: ${score}`);
        if(score == 6) {
            flag(player, "Nuker", "D", "World", "score", score, true);
            reset = true;
        } 
        const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
        if(distance > 1.5 && angleCalcRecode(player, block) > 90 && player.hasTag("moving")) {
            flag(player, "Nuker", "D", "World", "angle (1)", angleCalc(player, block));
            reset = true;
        }
        if(angleCalcRecode(player, block) < 0.3 && getSpeed(player) > 2) {
            flag(player, "Nuker", "D", "World", "angle (2)", angleCalc(player, block));
            reset = true;
        }
        if(reset == true) {
            block.setPermutation(resetValue);
        }
    }
}  