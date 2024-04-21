import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function motion_b(player) {
    const yVelocity = player.getVelocity().y;
    if(config.modules.motionB.enabled && Math.abs(yVelocity) > 40) {
        flag(player, "Motion", "B", "Movement", "yVelocity", yVelocity, true);
    }
}