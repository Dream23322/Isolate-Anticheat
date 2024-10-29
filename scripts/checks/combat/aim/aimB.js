import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getAbsoluteGcd } from "../../../utils/mathUtil.js";
import { fastAbs, fastFloor } from "../../../utils/fastMath.js";
import { getDeltaPitch, getDeltaYaw, getLastDeltaPitch, getLastDeltaYaw } from "./aimData.js";
export function aim_b(player) {
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
        if((deltaPitch % 1 == 0 || deltaYaw % 360 % 1 == 0) && deltaPitch !== 0 && deltaYaw !== 0 ) flag(player, "Aim", "B", "Combat (BETA)", "rounded", `${deltaYaw},${deltaPitch}`, false);
        // Invalid part 1
        const divisorX = deltaYaw % constantYaw;
        const divisorY = deltaPitch % constantPitch;
        const invalidX = deltaYaw > 0 && !Number.isFinite(divisorX);
        const invalidY = deltaPitch > 0 && !Number.isFinite(divisorY);
        if((invalidX || invalidY) && (player.hasTag("attacking") || !config.modules.aimB.needHit)) flag(player, "Aim", "B", "Rotation (BETA)", "divX", `${divisorX},divY=${divisorY}`, false);

        // Invalid part 2
        const currentYaw = deltaYaw / constantYaw;
        const currentPitch = deltaPitch / constantPitch;

        const floorYaw = fastFloor(currentYaw);
        const floorPitch = fastFloor(currentPitch);

        const moduloX = fastAbs(currentYaw - floorYaw);
        const moduloY = fastAbs(currentPitch - floorPitch);
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

            const floorModuloY = fastAbs(fastFloor(moduloY) - moduloY);
            const floorModuloX = fastAbs(fastFloor(moduloX) - moduloX);

            const invalidY3 = moduloY > 90 && floorModuloY > 0.1;
            const invalidX3 = moduloX > 90 && floorModuloX > 0.1;

            if((invalidX3 && invalidY3) && (player.hasTag("attacking") || !config.modules.aimB.needHit)) flag(player, "Aim", "B", "Combat", "modulo", `y=${moduloY},x=${moduloX}`)
        }
    }
}