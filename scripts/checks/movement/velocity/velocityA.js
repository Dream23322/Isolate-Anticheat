import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";
const data = new Map();
export function velocity_a(player) {
    // if(config.modules.velocityA.enabled) {
    //     if(data.get(player.name)) {
    //         const lastVelocity = data.get(player.name).hv;
    //         const velocity = hVelocity(player);
    //         if(player.hasTag("damaged") && !data.get(player.name).damaged) {
    //             const velocity_diff = Math.abs(velocity - lastVelocity);
    //             if(velocity_diff < config.modules.velocityA.diff) flag(player, "Velocity", "A", "Movement (BETA)", "Velocity", velocity, true);
    //         }
    //     }
    //     data.set(player.name, {
    //         hv: hVelocity(player),
    //         damaged: player.hasTag("damaged")
    //     })
    // }
    return;
}