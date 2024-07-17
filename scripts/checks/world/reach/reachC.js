import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { getDistanceXZ } from "../../../utils/mathUtil.js";

export function reach_c(player, block) {
    const playerVelocity = player.getVelocity();
	// Reach/B = checks for placing blocks too far away
	if(config.modules.reachC.enabled && !player.hasTag("noreach") && playerVelocity.y === 0 && player.fallDistance < 3) {
		const distance = getDistanceXZ(player, block);
		if (distance > config.modules.reachC.reach && player.fallDistance !== 0) {
			flag(player, "Reach", "C", "Placement", "distance", distance, false);
		}
	}
}	