import { flag } from "../../../util";
import config from "../../../data/config";
import { fastAbs } from "../../../utils/fastMath";
const data = new Map();

export function strafe_a(player) {
    if(!allowedPlatform(player, config.modules.strafeA.AP)) return;
    if(config.modules.strafeA.enabled) {
        const velocity = player.getVelocity();
        if(data.get(player.name)) {
            const lastVelocity = data.get(player.name);
            const invalid = (
                fastAbs(velocity.x) > 0.01 &&
                fastAbs(lastVelocity.x) > 0.01 &&
                (lastVelocity.x < 0 && velocity.x > 0.3 || lastVelocity.x > 0.3 && velocity.x < 0) ||
                fastAbs(velocity.z) > 0.01 &&
                fastAbs(lastVelocity.z) > 0.01 &&
                (lastVelocity.z < 0 && velocity.z > 0.3 || lastVelocity.z > 0.3 && velocity.z < 0)
            )
            const diff = {x: fastAbs(velocity.x) - fastAbs(lastVelocity.x), z: fastAbs(velocity.z) - fastAbs(lastVelocity.z)}
            const allow = !player.hasTag("jumping") && !player.hasTag("swimming") && !player.hasTag("trident") && velocity.y > 0 && !player.hasTag("elytra") && !player.hasTag("slime") && !player.getEffect("speed") && !player.hasTag("damaged") && !player.hasTag("placing") && !player.hasTag("gmc") && !player.hasTag("teleporting");
            if(invalid && allow) flag(player, "Strafe", "A", "Movement (BETA)", "x", `${diff.x},z=${diff.z}`, false);
        }
    }
    data.set(player.name, player.getVelocity());
}