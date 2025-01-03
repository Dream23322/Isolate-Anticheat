import * as Minecraft from "@minecraft/server";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { amountAccelPitch, amountAccelYaw } from "./aimData.js";
import { countDuplicates } from "../../../utils/maths/mathUtil.js";

export function aim_c(player) {
    if(!allowedPlatform(player, config.modules.aimC.AP) || !config.modules.aimC.enabled || (!player.hasTag("attacking") && config.modules.aimC.needHit)) return;

    const pitchAccelSamples = amountAccelPitch(player, 50);
    const yawAccelSamples = amountAccelYaw(player, 50);

    let deltaSamples = [];

    for(let i = 0; i < pitchAccelSamples.length; i++) {
        deltaSamples.push(pitchAccelSamples[i] - yawAccelSamples[i]);
    }

    const duplicates = countDuplicates(deltaSamples);

    if(duplicates > 35) flag(player, "Aim", "C", "Combat", "accelDuplicates", `${duplicates}`, false);
}
