import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";

export function aim_a(player) {
    if(config.modules.aimA.enabled) {
        return;
    }
}