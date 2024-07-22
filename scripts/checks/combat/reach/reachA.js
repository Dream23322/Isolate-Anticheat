import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { getBlocksBetween, getDistanceY, getSpeed } from "../../../utils/mathUtil.js";
import { getBlock_two } from "../../../utils/gameUtil.js";
export function reach_a(player, entity) {
	if(config.modules.reachA.enabled) {
		if(failedTags(player)) return;
		setScore(player, "reach_a_reset", getScore(player, "reach_a_reset", 0) + 1);
		let xz_distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));
		if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${xz_distance}\nPlayer Tags: ${player.getTags()}`);
		let y_distance = getDistanceY(player, entity);
		checkDistance(player, xz_distance, y_distance, entity);
		if(getScore(player, "reach_a_reset", 0) > 10) {
			if(getScore(player, "reach_a_buffer", 0) > config.modules.reachA.buffer) {
				flag(player, "Reach", "A", "Combat", "distance", `${xz_distance}, `, true);
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

function checkDistance(player, xy_distance, y_distance, entity) {
	const mx_reach = getMaxReach(player, entity, y_distance);
	if(xy_distance > mx_reach && !config.modules.reachA.entities_blacklist.includes(entity.typeId)) {
		setScore(player, "reach_a_buffer", getScore(player, "reach_a_buffer", 0) + 1);
	}
}

function getMaxReach(player, entity, y_distance) {
	let max_reach = config.modules.reachA.reach;

	// Check if smart reach is enabled in the config
	if(config.modules.reachA.smartReach) {

		// Having high speed in PvP can cause BDS Prediction to correct your movement and mess with your reach
		if(getSpeed(player) > 0.4) max_reach += 0.2;

		// Taking damage often will result in knockback so we account for that movement
		if(player.hasTag("damaged")) max_reach += 0.04;

		// If the player is sprinting then we can increase the reach
		if(player.isSprinting) max_reach -= 0.2;

		// Players who have been kicked before will have a higher chance of cheating.
		if(player.hasTag("strict")) max_reach -= 0.2;
		
	}
	// Dynamic reach checks for world conditions that can cause the players max reach to be lower than normal
	if(config.modules.reachA.dynamicReach) {
 
		// Being in water can be funny for reach
		if(getBlocksBetween(player.location, player.location) === "minecraft:water" || getBlocksBetween(player.location, player.location) === "minecraft:lava") {
			max_reach -= 0.7;
		}
		// If the player is hitting an iron golem, the golem will have less reach and therefore your average reach will be less
		if(entity.typeId.includes("iron")) max_reach -= 0.5;

		// If the player isnt moving their max reach will decrease as BDS Prediction will not be correcting their movement.
		if(!player.hasTag("moving")) max_reach -= 0.5;

		// Using some basic maths, you can understand that if a player is above their opponent, the opponent will have an easier reach as reach is calculated from the players head.
		// There is some technoblade (RIP) vs dream breakdown which explains it a bit more.
		if(entity.location.y < player.location.y) max_reach -= 0.2;
	}
	// Make sure the reach value isnt below 3.1 blocks
	if(max_reach < 3.1) return config.modules.reachA.reach;

	// Return the final reach value.
	return max_reach;
}
