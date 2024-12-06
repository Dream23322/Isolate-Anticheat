import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getBlocksBetween, getSpeed } from "../../../utils/maths/mathUtil.js";
import { fastAbs, fastPow, fastSqrt } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();

export function reach_b(player, entity) {
	if(!allowedPlatform(player, config.modules.reachB.AP)) return;
	if(config.modules.reachB.enabled) {
		if(player.hasTag("gmc") || config.modules.reachB.entities_blacklist.includes(entity.typeId)) return;
		let xz_distance = fastSqrt(fastPow(entity.location.x - player.location.x, 2) + fastPow(entity.location.z - player.location.z, 2));
		const d = data.get(player.name) ?? (new Array(15)).fill(0);
		if(d) {
			const avg = fastAbs((xz_distance + d[0] + d[1] + d[2] + d[3] + d[4] + d[5] + d[6] + d[7] + d[8] + d[9] + d[10] + d[11] + d[12] + d[13] + d[14]) / 15);
			if(player.hasTag('reachDebug')) console.log("Reach: ", avg)
			if(avg > getMaxReach(player, entity)) {
				flag(player, "Reach", "B", "Combat", "reach", `${avg.toFixed(5)},max=${getMaxReach(player, entity)}`, true);
			}
			d.unshift(xz_distance);
			d.pop();
		}
		data.set(player.name, d);
	}
}

function getMaxReach(player, entity) {
	let max_reach = config.modules.reachB.reach;

	// 2/12/24 - dynamic and smart reach is basically just the same thing so I will probably merge these together at some point.
	// ^^^ This also applies to Reach/A.

	// Check if smart reach is enabled in the config
	if(config.modules.reachB.smartReach) {

		// Having high speed in PvP can cause BDS Prediction to correct your movement and mess with your reach
		if(getSpeed(player) > 0.4) max_reach += 0.2;

		// Taking damage often will result in knockback so we account for that movement
		if(player.hasTag("damaged")) max_reach += 0.11;
		else max_reach -=0.01;

		// If the player is sprinting then we can increase the reach
		if(player.isSprinting) max_reach += 0.15;
		else max_reach -= 0.05;

		// Players who have been kicked before will have a higher chance of cheating.
		if(player.hasTag("strict")) max_reach -= 0.2;
		
	}
	// Dynamic reach checks for world conditions that can cause the players max reach to be lower than normal
	if(config.modules.reachB.dynamicReach) {
 
		// Being in water can be funny for reach
		if(getBlocksBetween(player.location, player.location) === "minecraft:water" || getBlocksBetween(player.location, player.location) === "minecraft:lava") {
			max_reach -= 0.3;
		}

		// If the player isnt moving their max reach will decrease as BDS Prediction will not be correcting their movement.
		if(!player.hasTag("moving")) max_reach -= 0.4;

		// When the player has slowness they are less likely to pull some crazy reach while legit.
		if(player.getEffect("slowness")) {
			const amp = player.getEffect("slowness").amplifier;

			// Account for amplifier.
			max_reach -= 0.005 * amp;

			// Cap for how much the max reach can be decreased to stop possible false flags.
			if(max_reach < 4) max_reach = 4;
		}

		// Using some basic maths, you can understand that if a player is above their opponent, the opponent will have an easier reach as reach is calculated from the players head.
		// There is some technoblade (RIP) vs dream breakdown which explains it a bit more.
		// ^^^ Old comment which now that I look back on it I find quite funny as it is legit just trig LOL
		// Continuing on the fact that it is just trig, maybe implement this into the check to make it more advanced.
		if(entity.location.y < player.location.y) max_reach -= 0.2;
	}
	// Make sure the reach value isnt below 3.1 blocks
	if(max_reach < 3.8) return config.modules.reachB.reach;

	// Return the final reach value.
	return max_reach;
}