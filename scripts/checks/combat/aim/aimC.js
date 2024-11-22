import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { EXPANDER, getgcd } from "../../../utils/mathUtil.js";

export function aim_c(player) {
    if(config.modules.aimC.enabled) {
        // Platform check
        if(!allowedPlatform(player, config.modules.aimC.AP)) return;

        // Variables
        let bufferVal = getScore(player, "aim_c_buffer", 0);


        const deltaPitch = getDeltaPitch(player);

        const lastDeltaPitch = getLastDeltaPitch(player);


        if(deltaPitch < 1.0) return false;
        const gcd = getgcd((deltaPitch * EXPANDER), (lastDeltaPitch * EXPANDER));

        // Test rotation
        if(
            gcd < 131072 &&
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
            flag(player, "Aim", "C", "Combat (BETA)", "gcd", `${gcd}`, false);
            // Reset the buffer score for the player
            setScore(player, "aim_c_buffer", 0);
        }
    }
}
