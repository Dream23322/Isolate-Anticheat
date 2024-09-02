import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";
import { fastSqrt } from "../../../utils/fastMath.js";

export function nuker_b(player, block, brokenBlockId) {
    if(config.modules.nukerB.enabled) {
        const angle = angleCalc(player, block);
        if(angle > 90) {
            // Calculate the distance between the player and the block
            const distance = fastSqrt(Math.pow(block.location.x - player.location.x, 2) +
                                       Math.pow(block.location.z - player.location.z, 2));
            if(brokenBlockId === "minecraft:bed" && distance > 1.5) flag(player, "Nuker", "B", "World", "angle", angle);
        }
    }
}

