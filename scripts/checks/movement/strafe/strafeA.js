import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
const data = new Map();

export function strafe_a(player) {
    if(!allowedPlatform(player, config.modules.strafeA.AP)) return;
    if(config.modules.strafeA.enabled) {
        const velocity = player.getVelocity();
        if(data.get(player.name)) {
            const lastVelocity = data.get(player.name);
            const invalid = (
                isomath.abs(velocity.x) > 0.01 &&
                isomath.abs(lastVelocity.x) > 0.01 &&
                (lastVelocity.x < 0 && velocity.x > 0.3 || lastVelocity.x > 0.3 && velocity.x < 0) ||
                isomath.abs(velocity.z) > 0.01 &&
                isomath.abs(lastVelocity.z) > 0.01 &&
                (lastVelocity.z < 0 && velocity.z > 0.3 || lastVelocity.z > 0.3 && velocity.z < 0)
            )
            const diff = {x: isomath.abs(velocity.x) - isomath.abs(lastVelocity.x), z: isomath.abs(velocity.z) - isomath.abs(lastVelocity.z)}
            const allow = !player.hasTag("jumping") && !player.hasTag("swimming") && !player.hasTag("trident") && velocity.y > 0 && !player.hasTag("elytra") && !player.hasTag("slime") && !player.getEffect("speed") && !player.hasTag("damaged") && !player.hasTag("placing") && !player.hasTag("gmc") && !player.hasTag("teleporting");
            if(invalid && allow) flag(player, "Strafe", "A", "Movement (BETA)", "x", `${diff.x},z=${diff.z}`, false);
        }
    }
    data.set(player.name, player.getVelocity());
}