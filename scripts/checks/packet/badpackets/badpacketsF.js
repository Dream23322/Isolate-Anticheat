import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function badpackets_f(player) {
    if(!allowedPlatform(player, config.modules.badpacketsF.AP)) return; 
    const rotation = player.getRotation();
    if(config.modules.badpacketsF.enabled && config.experimental_checks) {
        if(
            (Number.isInteger(rotation.x) || Number.isInteger(rotation.y)) && 
            rotation.x !== 0 && rotation.y !== 0 && rotation.x !== 60 && rotation.x !== -85 && rotation.y !== -90 && rotation.y !== 90 && rotation.y !== -180 && rotation.y !== 180 && 
            !player.hasTag("attacking") && !player.hasTag("riding")
        ) flag(player, "BadPackets", "F", "Rotation", "xRot",`${rotation.x},yRot=${rotation.y}`, false);
    }
}