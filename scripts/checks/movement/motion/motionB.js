import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/mathUtil.js";

export function motion_b(player) {
    const playerSpeed = getSpeed(player);
    if(config.modules.motionB.enabled) {
        return;
    }
}