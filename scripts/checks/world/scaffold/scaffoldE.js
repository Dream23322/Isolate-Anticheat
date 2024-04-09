import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

// Probs gonna recode this
export function scaffold_e(player) {
    const playerSpeed = getSpeed(player);
    // Scaffold/E = Speed limit check
    if(config.modules.scaffoldE.enabled) {
        if(!player.isFlying && !player.hasTag("gmc") && !player.hasTag("op")) {
            if(playerSpeed > config.modules.scaffoldE.speed && !player.hasTag("speed") || playerSpeed > config.modules.scaffoldE.speed - 0.1 && player.hasTag("strict")) {
                flag(player, "Scaffold", "E", "World", "speed", playerSpeed, false);
            }
        }
    }
}