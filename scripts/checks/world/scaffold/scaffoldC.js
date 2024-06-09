import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc, getDistanceXZ } from "../../../utils/mathUtil.js";

export function scaffold_c(player, block) {
    if(config.modules.scaffoldC.enabled) {
        if(angleCalc(player, block) > 90 && getDistanceXZ(player, block) > 2) {
            flag(player, "Scaffold", "C", "Placement (BETA)", "angle", `${angleCalc(player, block).toFixed(2)},dist=${getDistanceXZ(player, block).toFixed(2)}`, false);
        }
    }
}