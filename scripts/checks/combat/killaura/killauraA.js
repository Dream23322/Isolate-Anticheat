import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { fastAbs, fastHypot, fastPow, fastRound, fastSqrt } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";

export function killaura_a(player, entity) {
    if(!allowedPlatform(player, config.modules.killauraA.AP)) return;
    if(config.modules.killauraA.enabled) {
        const playerVelocity = player.getVelocity();
        const rot = player.getRotation();
        // github.com/jasonlaubb/Matrix-Anticheat/
        // good anticheat tbh
        if(!player.isGliding && fastHypot(playerVelocity.x, playerVelocity.z) > 0.2 && (rot.x % 5 == 0 || (rot.y % 5 == 0 && isomath.abs(rot.y) != 90)) && (rot.x != 0 || rot.y != 0)) {
            flag(player, "Killaura", "A", "Combat", "rotation-y%1", 0, false);
        }

        // This check is not from Matrix Anticheat
        // This part is to stop Prax killaura and as of my last knowledge is not in Matrix Anticheat.
        if(!Number.isInteger(rot.x) && (Number.isInteger(rot.x) || Number.isInteger(rot.y))) {
            flag(player, "Killaura", "A", "Combat", "rotx", `${rot.x},roty=${rot.y}`, false);
        }
        
        const rotation = player.getRotation()
        const distance = isomath.sqrt(isomath.pow(entity.location.x - player.location.x, 2) + isomath.pow(entity.location.z - player.location.z, 2));
        if(isomath.abs(rotation.x) > 79 && distance > 3.5 && !player.hasTag("trident") && !player.hasTag("bow")) {
            flag(player, "Killaura", "A", "Combat", "angle", `${rotation.x},distance=${distance}`, false);
        }

        // Fix bypass which i made lol
        const roundYaw = isomath.round(rot.y);
        if(
            (roundYaw == 0 || roundYaw == 90 || roundYaw == 180 || roundYaw == 270) &&
            isomath.abs(roundYaw - rot.y) < 0.4
        ) flag(player, "Killaura", "A", "Combat", "roundYaw", roundYaw + ", " + isomath.abs(roundYaw - rot.y), false);
    }
}