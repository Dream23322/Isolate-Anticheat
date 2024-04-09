import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";

export function hitbox_a(player, entity) {
    // Hitbox/A = Checks for not having the attacked player on your screen
    // This can cause some issues on laggy servers so im gonna have to try fix that
    if(config.modules.hitboxA.enabled && !player.hasTag("nohitbox")) {
        const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
        if(angleCalc(player, entity) > 95 && distance > 4 && entity.typeId !== "minecraft:enderman") {
            flag(player, "Hitbox", "A", "Combat", "angle", "> 90", false);
        }
    }
}