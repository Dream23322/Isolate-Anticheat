import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

// Probs gonna recode this
export function scaffold_e(player) {
    if(!allowedPlatform(player, config.modules.scaffoldE.AP)) return;
    const playerSpeed = getSpeed(player);
    // Scaffold/E = Speed limit check
    if(config.modules.scaffoldE.enabled && !player.isFlying && !player.hasTag("gmc") && !player.hasTag("op")&& (playerSpeed > config.modules.scaffoldE.speed && !player.hasTag("speed") || playerSpeed > config.modules.scaffoldE.speed - 0.1 && player.hasTag("strict"))) {
        flag(player, "Scaffold", "E", "World", "speed", playerSpeed, true);
    }
}