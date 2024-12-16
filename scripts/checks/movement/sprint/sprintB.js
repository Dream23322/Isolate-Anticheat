import { Player } from "@minecraft/server";
import { getPressedKeys } from "../../../utils/gameUtil";
import { flag } from "../../../utils/anticheat/punishment/flag";
import config from "../../../data/config";
import { allowedPlatform } from "../../../utils/platformUtils";

/**
 * 
 * @param {Player} player 
 */
export function sprint_b(player) {
    try {
        if(!player.isSprinting || !config.modules.sprintB.enabled || !allowedPlatform(player, config.modules.sprintB.AP) || player.inputInfo.lastInputModeUsed !== "KeyboardAndMouse" || !player.sprintLastTick) return;
    } catch (error) {
        return;
    }
    const keys = getPressedKeys(player);
    // Check if x movement keys arent press or no keys are pressed
    if(
        keys[0] != "W" &&
        keys[0] != "S"  &&
        keys[0] != "nokbm" || 
        keys.length < 1
    ) flag(player, "Sprint", "B", "Movement", "keys", keys.toString() + ",length" + keys.length + ",K1=" + keys[0], true);
}