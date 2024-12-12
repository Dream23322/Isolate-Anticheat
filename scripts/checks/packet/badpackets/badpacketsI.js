import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { abs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
export function badpackets_i(player) {
    if(!allowedPlatform(player, config.modules.badpacketsI.AP)) return;
    const rotation = player.getRotation();
    // Impossible Rotations
    // Having your pitch over 90 isnt possible! Horion client might be able to do it
    if(isomath.abs(rotation.x) > config.modules.badpacketsI.angle && config.modules.badpacketsI.enabled || isomath.abs(rotation.x) === 54.09275817871094 && config.modules.badpacketsI.enabled) flag(player, "BadPackets", "I", "Rotation", "angle", rotation.x, true);
}