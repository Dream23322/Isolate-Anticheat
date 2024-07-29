import { flag} from "../../../util";
import config from "../../../data/config.js";
import { angleCalc, getDistanceXZ } from "../../../utils/mathUtil.js";

export function scaffold_c(player, block) {
    if(config.modules.scaffoldC.enabled && angleCalc(player, block) > 90 && getDistanceXZ(player, block) > 2 && block.location.y < player.location.y) flag(player, "Scaffold", "C", "Placement (BETA)", "angle", `${angleCalc(player, block).toFixed(2)},dist=${getDistanceXZ(player, block).toFixed(2)}`, false);
}