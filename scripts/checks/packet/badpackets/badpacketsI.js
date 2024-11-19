import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function badpackets_i(player) {
    if(!allowedPlatform(player, config.modules.badpacketsI.AP)) return;
    const rotation = player.getRotation();
    // Impossible Rotations
    // Having your pitch over 90 isnt possible! Horion client might be able to do it
    if(fastAbs(rotation.x) > config.modules.badpacketsI.angle && config.modules.badpacketsI.enabled || fastAbs(rotation.x) === 54.09275817871094 && config.modules.badpacketsI.enabled) flag(player, "BadPackets", "I", "Rotation", "angle", rotation.x, true);
}