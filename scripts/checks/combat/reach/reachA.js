import * as isomath from "../../../utils/maths/isomath.js";
import { Player } from "@minecraft/server";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function reach_a(player, target) {
    if(!config.modules.reachA.enabled || !allowedPlatform(player, config.modules.reachA.AP) || player.hasTag("gmc")) return;

    const distance = isomath.pythag(
        target.location.x - player.location.x,
        target.location.z - player.location.z
    ) - 0.75 - (isomath.pythag(
        player.getVelocity().x,
        player.getVelocity().z
    ) * config.modules.reachA.predictionTicks) - (isomath.pythag(
        target.getVelocity().x,
        target.getVelocity().z
    ) * config.modules.reachA.predictionTicks);

    if(player.hasTag("debug_reach_a")) player.sendMessage(`dist: ${distance}, veloPlayer: ${isomath.pythag(player.getVelocity().x, player.getVelocity().z) * config.modules.reachA.predictionTicks}, veloTarget: ${isomath.pythag(target.getVelocity().x, target.getVelocity().z) * config.modules.reachA.predictionTicks}`);

    if(distance > config.modules.reachA.reach && distance < 10) flag(player, "Reach", "A", "Combat", "distance", distance, false);
}
