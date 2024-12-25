import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { getScore } from "../../../util";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function noslow_a(player) {
    if(!allowedPlatform(player, config.modules.noslowA.AP) || !config.modules.noslowA.enabled) return;

    const playerSpeed = getSpeed(player);
    let maxSpeed = player.hasTag("damaged") ? 0.35 : config.modules.noslowA.maxSpeed;

    if(player.getEffect("speed")) {
        maxSpeed += 0.2 * player.getEffect("speed").amplifier;
    }

    if(
        playerSpeed >= maxSpeed &&
        getScore(player, "right", 0) >= 4 &&
        !player.hasTag("ice") &&
        !player.hasTag("slime") &&
        !player.hasTag('gliding') &&
        !player.hasTag('swimming') &&
        !player.hasTag("trident")
    ) flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
}