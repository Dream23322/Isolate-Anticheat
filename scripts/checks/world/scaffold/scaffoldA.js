import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

/*
Yes this check is in other anticheats, no i didn't steal it from them.
*/

// To-Do:
// Make this better, use a more robust logic
export function scaffold_a(player, block, speed_a_map) {
    if(config.modules.scaffoldA.enabled) {
        const playerRotation = player.geRotation();
        if(playerRotation.x % 1 === 0) {
            flag(player, "Scaffold", "A", "World", "player rot", playerRotation.x % 1, false);
        }
    }

    if(config.modules.scaffoldA.enabled) {

    }
}