import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getScore } from "../../../util";
export function killaura_e(player, entity) {
    const rightTicks = getScore(player, "right");
    // Killaura/E = Check if a player attacks an entity while using an item (scythe check)
	if(config.modules.killauraE.enabled && player.hasTag("right")) {
        if(rightTicks > config.modules.killauraE.rightTicks) {
            flag(player, "Killaura", "E", "Combat", `ticks=${rightTicks}`);
        }
        console.log("running");
    }
}