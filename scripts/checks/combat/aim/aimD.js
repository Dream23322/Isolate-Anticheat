import * as Minecraft from "@minecraft/server";
import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/maths/mathUtil.js";
import { amountDeltaPitch, amountDeltaYaw, getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs } from "../../../utils/maths/standardMath.js";

/**
 * 
 * @param {Minecraft.Player} player 
 * @returns 
 */
export function aim_d(player) {
    if(!allowedPlatform(player, config.modules.aimD.AP)) return;
    if(config.modules.aimD.enabled) {
        
        const deltaPitch = getDeltaPitch(player);
        const deltaYaw = getDeltaYaw(player);

        const invalid = deltaPitch > 0 && deltaYaw < 0.005 || deltaPitch < 0.005 && deltaYaw > 0;

        if(invalid && (player.hasTag("aim_hit") || !config.modules.aimD.needHit) && abs(player.getRotation().x) > 70) {
            let buffer = player.aim_d_buffer || 0;
            if(buffer == 0) player.aim_d_buffer = 0;
            buffer++;
            player.aim_d_buffer++;
            if(buffer > 5) {
                flag(player, "Aim", "D", "Rotation (BETA)", "invalid", `${deltaYaw.toFixed(4)},${deltaPitch.toFixed(5)}`, false);
                player.aim_d_buffer = 0;
            }
        }

        const invalid2 = abs(deltaPitch - deltaYaw) < 0.1 && deltaYaw > 1;
        
        if(invalid2 && (player.hasTag("aim_hit") || !config.modules.aimD.needHit) && abs(player.getRotation().x) > 70) flag(player, "Aim", "D", "Combat", "invalid2", `${deltaYaw.toFixed(4)},${deltaPitch.toFixed(4)}`, true);

        const invalid3 = abs(abs(deltaPitch - deltaYaw) - abs(getLastDeltaYaw(player) - getLastDeltaPitch(player))) < 0.1

        if(invalid3 && (player.hasTag("aim_hit") || !config.modules.aimD.needHit)) flag(player, "Aim", "D", "Combat", "invalid3", `${deltaYaw.toFixed(4)},${deltaPitch.toFixed(4)}`, true);

    }
}