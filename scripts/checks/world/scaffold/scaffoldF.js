import * as Minecraft from "@minecraft/server";
import config from "../../../data/config.js";

import { getScore, setScore } from "../../../util";
export function scaffold_f(player, block) {
    // Scaffold/F = Place limit check (Amount of blocks placed in a scaffold ish way per 20 ticks)
    if(config.modules.scaffoldF.enabled) {
        const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2) && !player.hasTag("gmc") && !player.hasTag("op"));
        if(distance < 2) {
            const valueOfBlocks = getScore(player, "scaffoldAmount", 0)
            setScore(player, "scaffoldAmount", valueOfBlocks + 1);
        }
    }
}