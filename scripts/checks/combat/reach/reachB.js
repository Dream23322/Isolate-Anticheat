import { flag, getScore, setScore } from "../../../util.js";
import config from "../../../data/config.js";
import { getBlocksBetween, getDistanceXZ, getDistanceY, getSpeed } from "../../../utils/mathUtil.js";
const data = new Map();

export function reach_b(player, entity) {
	if(config.modules.reachB.enabled) {
		if(failedTags(player) || config.modules.reachB.entities_blacklist.includes(entity.typeId)) return;
		let xz_distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));
		if(data.get(player.name)) {
			const d = data.get(player.name);
			const avg = Math.abs((xz_distance + d.one + d.two + d.three + d.four + d.five + d.six + d.seven + d.eight + d.nine + d.ten + d.eleven + d.twelve + d.thirteen + d.fourteen) / 15);
			if(player.hasTag('reachDebug')) console.log("Reach: ", avg)
			if(avg > getMaxReach(player, entity) && !failedTags(player)) {
				flag(player, "Reach", "B", "Combat", "reach", avg, true);
			}
		}
		data.set(player.name, {
			one: xz_distance,
			two: data.get(player.name)?.one || 0,
			three: data.get(player.name)?.two || 0,
			four: data.get(player.name)?.three || 0,
			five: data.get(player.name)?.four || 0,
			six: data.get(player.name)?.five || 0,
			seven: data.get(player.name)?.six || 0,
			eight: data.get(player.name)?.seven || 0,
			nine: data.get(player.name)?.eight || 0,
			ten: data.get(player.name)?.nine || 0,
			eleven: data.get(player.name)?.ten || 0,
			twelve: data.get(player.name)?.eleven || 0,
			thirteen: data.get(player.name)?.twelve || 0,
			fourteen: data.get(player.name)?.thirteen || 0
		})
	}
}

function failedTags(player) {
	const tags = ["gmc", "op", "noreach"]
	for(const tag in tags) {
		if(player.hasTag(tag)) return true;
	} 
	return false;
}

function getMaxReach(player, entity) {
	let max_reach = config.modules.reachB.reach;

	// Check if smart reach is enabled in the config
	if(config.modules.reachB.smartReach) {

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
	if(config.modules.reachB.dynamicReach) {
 
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
	if(max_reach < 3.1) return config.modules.reachB.reach;

	// Return the final reach value.
	return max_reach;
}