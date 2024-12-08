import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getAbsoluteGcd } from "../../../utils/maths/mathUtil.js";
import { fastAbs, fastFloor } from "../../../utils/maths/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs, floor } from "../../../utils/maths/isomath.js";
export function aim_b(player) {
    if(!allowedPlatform(player, config.modules.aimB.AP)) return;
    if(config.modules.aimB.enabled) {
        // Define constants
        const deltaPitch = getDeltaPitch(player);
        const deltaYaw = getDeltaYaw(player);
        const deltaPitch2 = getLastDeltaPitch(player);
        const deltaYaw2 = getLastDeltaYaw(player);
        const constantYaw = getAbsoluteGcd(deltaYaw, deltaYaw2);
        const constantPitch = getAbsoluteGcd(deltaPitch, deltaPitch2);
        if(player.hasTag("aim_debug2")) player.sendMessage("constantYaw" + constantYaw + "constantPitch" + constantPitch);
        // Checks for rounded rotation
        if((deltaPitch % 1 === 0 || deltaYaw % 360 % 1 === 0) && deltaPitch !== 0 && deltaYaw !== 0 ) flag(player, "Aim", "B", "Combat (BETA)", "rounded", `${deltaYaw},${deltaPitch}`, false);
        // Invalid part 1
        const divisorX = deltaYaw % constantYaw;
        const divisorY = deltaPitch % constantPitch;
        const invalidX = deltaYaw > 0 && !Number.isFinite(divisorX);
        const invalidY = deltaPitch > 0 && !Number.isFinite(divisorY);
        if((invalidX || invalidY) && (player.hasTag("attacking") || !config.modules.aimB.needHit)) flag(player, "Aim", "B", "Rotation (BETA)", "divX", `${divisorX},divY=${divisorY}`, false);

        // Invalid part 2
        const currentYaw = deltaYaw / constantYaw;
        const currentPitch = deltaPitch / constantPitch;

        const floorYaw = floor(currentYaw);
        const floorPitch = floor(currentPitch);

        const moduloX = abs(currentYaw - floorYaw);
        const moduloY = abs(currentPitch - floorPitch);
        const invalidX2 = moduloX > 0.5 && !Number.isFinite(moduloX);
        const invalidY2 = moduloY > 0.5 && !Number.isFinite(moduloY);
        if((invalidX2 || invalidY2) && (player.hasTag("attacking") || !config.modules.aimB.needHit)) flag(player, "Aim", "B", "Rotation (BETA)", "modX", `${moduloX},modY=${moduloY}`, false);

        const currentY = deltaYaw / constantYaw;
        const currentX = deltaPitch / constantPitch;
        const previousY = deltaYaw2 / constantYaw;
        const previousX = deltaPitch2 / constantPitch;
        if(deltaYaw > 0 && deltaPitch > 0 && deltaYaw < 20 && deltaPitch < 20) {
            const moduloY = currentY % previousY;
            const moduloX = currentX % previousX;

            const floorModuloY = abs(floor(moduloY) - moduloY);
            const floorModuloX = abs(floor(moduloX) - moduloX);

            const invalidY3 = moduloY > 90 && floorModuloY > 0.1;
            const invalidX3 = moduloX > 90 && floorModuloX > 0.1;

            if((invalidX3 && invalidY3) && (player.hasTag("attacking") || !config.modules.aimB.needHit)) flag(player, "Aim", "B", "Combat", "modulo", `y=${moduloY},x=${moduloX}`)
        }
    }
}