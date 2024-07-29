import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { getDistanceXZ } from "../../../utils/mathUtil.js";

export function reach_c(player, block) {
	if(config.modules.reachC.enabled) {
		const distance = getDistanceXZ(player, block);
		if(distance > getMax(player, block) && !player.hasTag("op") && !player.hasTag("gmc")) {
			flag(player, "Reach", "C", "Placement", "distance", distance, false);
		}
	}
}	

function getMax(player, block) {
	let maxReach = config.modules.reachC.reach;
	if(player.hasTag("damaged")) maxReach += 0.5;
	if(player.isSprinting) maxReach -= 0.1;
	if(block.typeId === "minecraft:bed") maxReach += 1;

	return maxReach;
}