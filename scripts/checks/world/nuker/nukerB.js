import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";
import { angleCalc } from "../../../utils/mathUtil.js";
export function nuker_b(player, block, brokenBlockId) {
	if(config.modules.nukerB.enabled) {
        if(angleCalc(player, block) > 90) {
            const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
            if(brokenBlockId === "minecraft:bed" && distance > 1.5) {
                flag(player, "Nuker", "B", "World", "angle", angleCalc(player, block));
            }
        }
    }
}