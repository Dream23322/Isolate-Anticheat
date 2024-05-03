import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getAbsoluteGcd } from "../../../utils/mathUtil.js";
const data = new Map();
export function aim_b(player) {
    if(config.modules.aimB.enabled) {
        const rotation = player.getRotation();
        if(data.has(player.name)) {
            const pitchDat = data.get(player.name).pitch;
            const yawDat = data.get(player.name).yaw;
            if(pitchDat && yawDat) {
                // Define constants
                const deltaPitch = Math.abs(rotation.x - pitchDat.one);
                const deltaYaw = Math.abs(rotation.y - yawDat.one);
                const deltaPitch2 = Math.abs(pitchDat.one - pitchDat.two);
                const deltaYaw2 = Math.abs(yawDat.one - yawDat.two);
                const constantYaw = getAbsoluteGcd(deltaYaw, deltaYaw2);
                const constantPitch = getAbsoluteGcd(deltaPitch, deltaPitch2);
                if(player.hasTag("aim_debug2")) player.sendMessage("constantYaw" + constantYaw + "constantPitch" + constantPitch);
                // Checks for rounded rotation
                if((deltaPitch % 1 == 0 || deltaYaw % 1 == 0) && deltaPitch !== 0 && deltaYaw !== 0 ) flag(player, "Aim", "B", "Rotation", "rounded", `${deltaYaw},${deltaPitch}`, false);
                if((Number.isInteger(deltaPitch) || Number.isInteger(deltaYaw)) && deltaPitch !== 0 && deltaYaw !== 0) flag(player, "Aim", "B", "Rotation (BETA)", "int", `${deltaYaw},${deltaPitch}`, false);
                // Invalid part 1
                const divisorX = deltaYaw % constantYaw;
                const divisorY = deltaPitch % constantPitch;
                const invalidX = deltaYaw > 0 && !Number.isFinite(divisorX);
                const invalidY = deltaPitch > 0 && !Number.isFinite(divisorY);
                if(invalidX || invalidY) flag(player, "Aim", "B", "Rotation (BETA)", "divX", `${divisorX},divY=${divisorY}`, false);

                // Invalid part 2
                const currentYaw = deltaYaw / constantYaw;
                const currentPitch = deltaPitch / constantPitch;

                const floorYaw = Math.floor(currentYaw);
                const floorPitch = Math.floor(currentPitch);

                const moduloX = Math.abs(currentYaw - floorYaw);
                const moduloY = Math.abs(currentPitch - floorPitch);
                const invalidX2 = moduloX > 0.5 && !Number.isFinite(moduloX);
                const invalidY2 = moduloY > 0.5 && !Number.isFinite(moduloY);
                if(invalidX2 || invalidY2) flag(player, "Aim", "B", "Rotation (BETA)", "modX", `${moduloX},modY=${moduloY}`, false);
            }
        }
        data.set(player.name, {
            pitch: {
                one: rotation.x,
                two: data.get(player.name)?.pitch?.one || 0,
                three: data.get(player.name)?.pitch?.two || 0
            },
            yaw: {
                one: rotation.y,
                two: data.get(player.name)?.yaw?.one || 0,
                three: data.get(player.name)?.yaw?.two || 0
            }
        })
    }
}