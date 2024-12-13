import { Player } from "@minecraft/server";
/**
 * @param {Player} player 
 */
export function sprint_a(player) {
    // Make sure the player wasnt sprinting lastTick and had blindness last tick
    if(player.sprintLastTick && player.blindnessLastTick && !player.canFlagSprintA) {
        return;
    }

    if(!player.isSprinting) player.canFlagSprintA = false;

    if (player.isSprinting && player.getEffect("blindness")) {
        player.canFlagSprintA = true;
        flag(player, "Sprint", "A", "Movement", "sprint", `${player.isSprinting},blindness=${player.getEffect("blindness").amplifier}`, true);
    }
}