import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { getScore, setScore } from "../../../util";
import * as isomath from "../../../utils/maths/isomath.js";

export function scaffold_f(player, block) {
    if(!allowedPlatform(player, config.modules.scaffoldF.AP,)) return;
    // Scaffold/F = Place limit check (Amount of blocks placed in a scaffold ish way per 20 ticks)
    if(config.modules.scaffoldF.enabled) {
        const distance = isomath.sqrt(isomath.pow(block.location.x - player.location.x, 2) + isomath.pow(block.location.y - player.location.y, 2) + isomath.pow(block.location.z - player.location.z, 2));
        if(distance < 2 && !player.hasTag("gmc") && !player.hasTag("op")) {
            const valueOfBlocks = getScore(player, "scaffoldAmount", 0)
            setScore(player, "scaffoldAmount", valueOfBlocks + 1);
        }
    }
}