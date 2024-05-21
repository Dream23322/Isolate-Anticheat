import { flag, debug } from "../../../util";
import config from "../../../data/config";
import { hVelocity } from "../../../utils/mathUtil";
const data = new Map();

export function strafe_a(player) {
    if(config.modules.strafeA.enabled) {
        const velocity = player.getVelocity();
        if(data.get(player.name)) {
            const lastVelocity = data.get(player.name);
            const invalid = (
                Math.abs(velocity.x) > 0.01 &&
                Math.abs(lastVelocity.x) > 0.01 &&
                (lastVelocity.x < 0 && velocity.x > 0.28 || lastVelocity.x > 0.28 && velocity.x < 0) ||
                Math.abs(velocity.z) > 0.01 &&
                Math.abs(lastVelocity.z) > 0.01 &&
                (lastVelocity.z < 0 && velocity.z > 0.28 || lastVelocity.z > 0.28 && velocity.z < 0)
            )
            const diff = {x: Math.abs(velocity.x) - Math.abs(lastVelocity.x), z: Math.abs(velocity.z) - Math.abs(lastVelocity.z)}
            const allow = !player.hasTag("jumping") && !player.hasTag("swimming") && !player.hasTag("trident") && velocity.y > 0 && !player.hasTag("elytra") && !player.hasTag("slime") && !player.getEffect("speed") && !player.hasTag("damaged") && !player.hasTag("placing");
            if(invalid && allow) flag(player, "Strafe", "A", "Movement (BETA)", "x", `${diff.x},z=${diff.z}`, false);
        }
    }
    data.set(player.name, player.getVelocity());
}