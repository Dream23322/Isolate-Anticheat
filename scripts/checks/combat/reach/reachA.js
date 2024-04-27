import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { getDistanceXZ, getDistanceY, getSpeed, hVelocity } from "../../../utils/mathUtil.js";
export function reach_a(player, entity) {
	if(config.modules.reachA.enabled) {
		if(failedTags(player)) return;
		setScore(player, "reach_a_reset", getScore(player, "reach_a_reset", 0) + 1);
		let xz_distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));
		if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${xz_distance}\nPlayer Tags: ${player.getTags()}`);
		let y_distance = getDistanceY(player, entity);
		checkDistance(player, xz_distance, y_distance);
		if(getScore(player, "reach_a_reset", 0) > 10) {
			if(getScore(player, "reach_a_buffer", 0) > config.modules.reachA.buffer) {
				flag(player, "Reach", "A", "Combat", "distance", xz_distance, false);
			}
			setScore(player, "reach_a_buffer", 0);
			setScore(player, "reach_a_reset", 0);
		}
	}
}

function failedTags(player) {
	const tags = ["gmc", "op", "noreach"]
	for(const tag in tags) {
		if(player.hasTag(tag)) return true;
	} 
	return false;
}

function checkDistance(player, xy_distance, y_distance) {
	let min_reach = config.modules.reachA.reach;
	if(config.modules.reachA.smartReach) {
		if(getSpeed(player) > 0.6) min_reach + 0.3;
		if(player.hasTag("damaged")) min_reach + 0.04;
		if(player.isSprinting) min_reach - 0.2;
	}
	if(xy_distance > min_reach) {
		setScore(player, "reach_a_buffer", getScore(player, "reach_a_buffer", 0) + 1);
	}
}