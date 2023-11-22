import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_i(player) {
    const rotation = player.getRotation();
    // Impossible Rotations
    // Having your pitch over 90 isnt possible! Horion client might be able to do it
    if(Math.abs(rotation.x) > config.modules.badpacketsI.angle && config.modules.badpacketsI.enabled || Math.abs(rotation.x) === 54.09275817871094 && config.modules.badpacketsI.enabled) {
        flag(player, "BadPackets", "I", "Rotation", "angle", rotation.x, true);
    }
}