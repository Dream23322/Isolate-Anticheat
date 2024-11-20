import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function aim_c(player) {
    if(config.modules.aimC.enabled) {
        // Platform check
        if(!allowedPlatform(player, config.modules.aimC.AP)) return;

        // Variables
        const rot = player.getRotation();
        let bufferVal = getScore(player, "aim_c_buffer", 0);
        const deltaPitch = getDeltaPitch(player);
        const deltaYaw = getDeltaYaw(player);

        // Test rotation
        if(
            !testRotation(rot, deltaPitch, deltaYaw)
            (player.hasTag("attacking") || !config.modules.aimC.needHit)
        ) {
            // Increment the buffer score for the player
            setScore(player, "aim_c_buffer", bufferVal + 1);
            bufferVal++;
            // Log the buffer score for debugging purposes
            console.warn(`${player.name} | Aim C Buffer: ${getScore(player, "aim_c_buffer", 0)}`);
        }
        // Check if the buffer score exceeds the threshold for the Aim C module
        if(bufferVal > config.modules.aimC.buffer) {
            // Flag the player with the Aim C module and the rotation data
            flag(player, "Aim", "C", "Combat (BETA)", "Accel", `${deltaYaw},${deltaPitch}`, false);
            // Reset the buffer score for the player
            setScore(player, "aim_c_buffer", 0);
        }
    }
}

function testRotation(rot, deltaPitch, deltaYaw) {
    const pitchTest = deltaPitch && (deltaYaw > 3.0 && deltaYaw < 35.0);
    const yawTest = deltaYaw && (deltaPitch > 3.0 && deltaPitch < 35.0);
    const exempt = player.hasTag("riding");
    return !exempt && (pitchTest || yawTest) && fastAbs(rot.x) < 89;
}