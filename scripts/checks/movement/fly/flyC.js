import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
const fly_c_data = new Map();
export function fly_c(player) {
    const y_velocity = player.getVelocity().y;	
    if(config.modules.flyC.enabled && inAir(player) && aroundAir(player)) {
        const fly_data = {a: fly_c_data.get(player)?.a, b: fly_c_data.get(player)?.b};
        const invalid_movement = (
            fly_data.b <= fly_data.a &&
            fly_data.a <= y_velocity
        );
        if(invalid_movement) {
            flag(player, "Fly", "C", "Movement", "y-velocity", y_velocity, true);
        }

        // Update maps
        fly_c_data.set({
            a: y_velocity,
            b: fly_c_data.get(player)?.a
        });
    }
}