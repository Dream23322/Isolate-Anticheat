import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getScore, setScore } from "../../../util";
import { angleCalc } from "../../../utils/mathUtil.js";

export function killaura_f(player, entity) {
    if(config.modules.killauraF.enabled) {
        // Turn this into rotation checks or miss rate check.
        return;
    }  
}