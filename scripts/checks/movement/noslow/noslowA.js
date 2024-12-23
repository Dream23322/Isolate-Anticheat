import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { getScore } from "../../../util";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function noslow_a(player) {
    if(!allowedPlatform(player, config.modules.noslowA.AP)) return;
    const playerSpeed = getSpeed(player);
    if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("no-noslow") && !player.getEffect("speed") && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right") >= 5 && (!player.hasTag("damaged") || player.getVelocity().y)) {
        flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
    }
}