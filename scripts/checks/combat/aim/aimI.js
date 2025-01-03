import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { amountDeltaPitch, amountDeltaYaw, getDeltaPitch, getDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function aim_i(player) {
    if(!allowedPlatform(player, config.modules.aimI.AP || !config.modules.aimI.enabled)) return;

    // Checks for constant acceleration

    const deltaYawData = amountDeltaYaw(player, 5);

    // First Accel
    const deltaYaw = deltaYawData[0];
    const lastDeltaYaw = deltaYawData[1];

    const yawAccel = isomath.abs(deltaYaw - lastDeltaYaw);

    // Second Accel
    const deltaYaw2 = deltaYawData[2];
    const lastDeltaYaw2 = deltaYawData[3];

    const yawAccel2 = isomath.abs(deltaYaw2 - lastDeltaYaw2);

    const yawAccelDiff = isomath.abs(yawAccel - yawAccel2);

    // Make sure no values are 0
    if(yawAccel == 0 || yawAccel2 == 0 || deltaYaw < 3 || lastDeltaYaw < 3 || deltaYaw2 < 3 || lastDeltaYaw2 < 3) return;

    if(yawAccelDiff < 0.11 && yawAccelDiff > 0.001 && (player.hasTag("aim_hit") || !config.modules.aimI.needHit)) flag(player, "Aim", "I", "Combat (BETA)", "yawAccel", `1:${yawAccel.toFixed(3)},2:${yawAccel2.toFixed(3)},diff:${yawAccelDiff.toFixed(3)}`, true);

    // Third Accel
    const deltaYaw3 = deltaYawData[4];
    const lastDeltaYaw3 = deltaYawData[5];

    const yawAccel3 = isomath.abs(deltaYaw3 - lastDeltaYaw3);

    // This part, we check if the players accel has had a constant increase
    const yawAccelDiff2 = isomath.abs(yawAccel2 - yawAccel3);

    const difference = isomath.abs(yawAccelDiff - yawAccelDiff2);

    if(difference < 0.1) flag(player, "Aim", "I", "Combat (BETA)", "yawAccelDiff", `1:${yawAccelDiff.toFixed(3)},2:${yawAccelDiff2.toFixed(3)},diff:${difference.toFixed(3)}`, true);
}