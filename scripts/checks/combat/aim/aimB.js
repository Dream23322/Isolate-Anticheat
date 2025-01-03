import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getDeltaPitch, getDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
export function aim_b(player) {
    if(!allowedPlatform(player, config.modules.aimB.AP)) return;
    if(config.modules.aimB.enabled) {
        // Define constants
        const deltaPitch = getDeltaPitch(player);
        const deltaYaw = getDeltaYaw(player);
        // Checks for rounded rotation
        if((deltaPitch % 1 === 0 || deltaYaw % 360 % 1 === 0) && deltaPitch !== 0 && deltaYaw !== 0 ) flag(player, "Aim", "B", "Combat (BETA)", "rounded", `${deltaYaw.toFixed(4)},${deltaPitch.toFixed(4)}`, false);
    }
}