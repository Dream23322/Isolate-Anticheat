import { Player } from "@minecraft/server";
import { getPressedKeys } from "../../../utils/gameUtil";

/**
 * 
 * @param {Player} player 
 */
export function sprint_b(player) {
    if(!player.isSprinting) return;
    const keys = getPressedKeys(player);
    // Check if x movement keys arent press or no keys are pressed
    if(
        !keys.includes("W") && 
        !keys.includes("S") ||
        !keys.length  < 1
    ) flag(player, "Sprint", "B", "Movement", "keys", keys.length, true);
}