import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getAbsoluteGcd } from "../../../utils/mathUtil.js";
import { fastAbs, fastFloor } from "../../../utils/fastMath.js";
const data = new Map();
export function aim_b(player) {
    if(config.modules.aimB.enabled) {
        const rotation = player.getRotation();
        if(data.has(player.name)) {
            const pitchDat = data.get(player.name).pitch;
            const yawDat = data.get(player.name).yaw;
            if(pitchDat && yawDat) {
                // Define constants
                const deltaPitch = fastAbs(rotation.x - pitchDat.one);
                const deltaYaw = fastAbs(rotation.y - yawDat.one);
                const deltaPitch2 = fastAbs(pitchDat.one - pitchDat.two);
                const deltaYaw2 = fastAbs(yawDat.one - yawDat.two);
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
                if(invalidX || invalidY) flag(player, "Aim", "B", "Rotation (BETA)", "divX", `${divisorX},divY=${divisorY}`, false);

                // Invalid part 2
                const currentYaw = deltaYaw / constantYaw;
                const currentPitch = deltaPitch / constantPitch;

                const floorYaw = fastFloor(currentYaw);
                const floorPitch = fastFloor(currentPitch);

                const moduloX = fastAbs(currentYaw - floorYaw);
                const moduloY = fastAbs(currentPitch - floorPitch);
                const invalidX2 = moduloX > 0.5 && !Number.isFinite(moduloX);
                const invalidY2 = moduloY > 0.5 && !Number.isFinite(moduloY);
                if(invalidX2 || invalidY2) flag(player, "Aim", "B", "Rotation (BETA)", "modX", `${moduloX},modY=${moduloY}`, false);

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

                    if(invalidX3 && invalidY3) flag(player, "Aim", "B", "Combat", "modulo", `y=${moduloY},x=${moduloX}`)
                }
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