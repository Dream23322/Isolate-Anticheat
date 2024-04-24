import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_c(player, block) {
    // Patched all scaffold hacks for minecraft bedrock edition
    if(config.modules.scaffoldC.enabled) {
        // Get what item the player is holding
        if(!player.hasTag("useItem") && !player.getEffect("speed") && player.hasTag("left")) {
            setScore(player, "scaffold_c_buffer", getScore(player, "scaffold_c_buffer", 0) + 1);
            if(getScore(player, "scaffold_c_buffer", 0) > 10) {
                flag(player, "Scaffold", "C", "World", "buffer", getScore(player, "scaffold_c_buffer", 0), false);
            }
        }
        if(getScore(player, "scaffold_c_reset", 0) > 2) {
            setScore(player, "scaffold_c_buffer", 0);
            setScore(player, "scaffold_c_reset", 0);
        }
    }
}