import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";
import { getScore } from "../../../util";

export function noslow_a(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = getSpeed(player);
    if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("no-noslow") && !player.getEffect("speed") && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right") >= 5 && !player.hasTag("damaged")) {
        flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
    }
}