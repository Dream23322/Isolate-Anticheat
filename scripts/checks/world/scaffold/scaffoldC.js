import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_c(player, block) {
    // Patched all scaffold hacks for minecraft bedrock edition
    if(config.modules.scaffoldC.enabled) {
        // Get what item the player is holding
        if(!player.hasTag("useItem")) {
            setScore(player, "scaffold_c_buffer", getScore(player, "scaffold_c_buffer", 0) + 1);
            if(getScore(player, "scaffold_c_buffer", 0) > config.modules.scaffoldC.buffer) {
                flag(player, "Scaffold", "C", "World", "packet!", "useItem", false);
            }

        }
        if(getScore(player, "scaffold_c_reset", 0) > config.modules.scaffoldC.reset) {
            setScore(player, "scaffold_c_buffer", 0);
            setScore(player, "scaffold_c_reset", 0);
        }
    }
}