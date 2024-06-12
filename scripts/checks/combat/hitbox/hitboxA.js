import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc, getDistanceXYZ } from "../../../utils/mathUtil.js";
export function hitbox_a(player, entity) {
    // Hitbox/A = Checks for not having the attacked player on your screen
    if(config.modules.hitboxA.enabled && !player.hasTag("nohitbox")) {
        const distance = getDistanceXYZ(player, entity);
        if(angleCalc(player, entity) > 95 && distance > 4 && entity.typeId !== "minecraft:enderman") {
            setScore(player, "hitbox_a_buffer", getScore(player, "hitbox_a_buffer", 0) + 1);
        }
        setScore(player, "hitbox_a_reset", getScore(player, "hitbox_a_reset", 0) + 1);
        if(getScore(player, "hitbox_a_reset", 0) > 20) {
            if(getScore(player, "hitbox_a_buffer", 0) > config.modules.hitboxA.buffer) {
                flag(player, "Hitbox", "A", "Combat", "angle", `${angleCalc(player, entity)},score=${getScore(player, "hitbox_a_buffer", 0)}`, false);
            }
            setScore(player, "hitbox_a_buffer", 0);
            setScore(player, "hitbox_a_reset", 0);
        }
    }
}