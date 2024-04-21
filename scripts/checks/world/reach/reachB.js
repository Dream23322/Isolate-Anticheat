import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";

export function reach_b(player, block) {
    const playerVelocity = player.getVelocity();
	// Reach/B = checks for placing blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach") && playerVelocity.y === 0 && player.fallDistance < 3) {
		const dx = block.location.x - player.location.x;
		const dz = block.location.z - player.location.z;
		const distance = Math.hypot(dx, dz);

		if (distance > config.modules.reachB.reach && player.fallDistance !== 0) {
			flag(player, "Reach", "B", "Placement", "distance", distance, false);
		}

		if (distance === 1.25) {
			flag(player, "Scaffold", "E", "Placement", "distance", distance, false);
		}
	}
}