import { Player } from "@minecraft/server";
import { getPressedKeys } from "../../../utils/gameUtil";
import { flag } from "../../../utils/anticheat/punishment/flag";

/**
 * 
 * @param {Player} player 
 */
export function sprint_b(player) {
    if(!player.isSprinting) return;
    const keys = getPressedKeys(player);
    // Check if x movement keys arent press or no keys are pressed
    if(
        keys[0] != "W" &&
        keys[0] != "S" || 
        keys.length < 1
    ) flag(player, "Sprint", "B", "Movement", "keys", keys.toString() + ",length" + keys.length + ",K1=" + keys[0], true);
}