import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getDistanceXZ } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function reach_c(player, block) {
	if(!allowedPlatform(player, config.modules.reachC.AP)) return;
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