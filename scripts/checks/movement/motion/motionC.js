import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";

export function motion_c(player) {
    const playerVelocity = player.getVelocity();
    if(config.modules.motionC.enabled && Math.abs(playerVelocity.y).toFixed(4) === "0.1552" && !player.isJumping && !player.isGliding && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving") && !player.hasTag("gmc") && !player.hasTag("damaged")) {
        const pos1 = {x: player.location.x - 2, y: player.location.y - 1, z: player.location.z - 2};
        const pos2 = {x: player.location.x + 2, y: player.location.y + 2, z: player.location.z + 2};

        const isInAir = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:air");
        if(isInAir && aroundAir(player) && player.fallDistance < 30) flag(player, "Motion", "C", "Movement", "vertical_speed", Math.abs(playerVelocity.y).toFixed(4), true);
            else if(config.debug) console.warn(`${new Date().toISOString()} | ${player.name} was detected with Motion/C but was found near solid blocks.`);
    } 
}