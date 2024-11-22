import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { arrayToList, EXPANDER, getAverage, getgcd } from "../../../utils/mathUtil.js";

const data = new Map();

export function aim_c(player) {
    if(config.modules.aimC.enabled) {
        // Platform check
        if(!allowedPlatform(player, config.modules.aimC.AP)) return;

        // Variables
        let bufferVal = getScore(player, "aim_c_buffer", 0);


        const deltaPitch = getDeltaPitch(player);

        const lastDeltaPitch = getLastDeltaPitch(player);


        if(deltaPitch < 1.0) return false;
        let gcd = getgcd((deltaPitch * EXPANDER), (lastDeltaPitch * EXPANDER));
        if(gcd > 131072) return;

        const d = data.get(player.name) ?? (new Array(10)).fill(0);
        // Convert GCD to normal int
        gcd = Number(gcd);
        d.unshift(gcd);

        if(d.length > 10) d.pop();

        // Get the average gcd
        const dataList = arrayToList(d);
        const averageGCD = fastAbs(dataList[0] + dataList[1] + dataList[2] + dataList[3] + dataList[4], dataList[5] + dataList[6] + dataList[7] + dataList[8] + dataList[9]) / 10;
        if(
            averageGCD > 2000 &&
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
            flag(player, "Aim", "C", "Combat (BETA)", "gcd", `${gcd},avg=${averageGCD}`, false);
            // Reset the buffer score for the player
            setScore(player, "aim_c_buffer", 0);
        }
        data.set(player.name, d);
    }
}
