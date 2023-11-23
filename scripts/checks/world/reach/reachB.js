import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";

export function reach_b(player, block) {
    const playerVelocity = player.getVelocity();
	// Reach/B = checks for placing blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach") && playerVelocity.y === 0 && player.fallDistance < 3) {
		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2));
		if(distance > config.modules.reachB.reach && player.fallDistance !== 0) {
			flag(player, "Reach", "B", "Placement", "distance", distance, false);
			undoPlace = true;
		}
		if(distance === 1.25) {
			flag(player, "Scaffold", "E", "Placement", "distance", distance, false);
		}
	}
}