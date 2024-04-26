import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getDistanceXZ, getSpeed, hVelocity } from "../../../utils/mathUtil.js";
export function reach_a(player, entity) {
	
	// reach/A = check if a player hits an entity more then 5.1 blocks away
	if((config.modules.reachA.enabled || config.generalModules.reach) && !player.hasTag("noreach")) {
		// get the difference between 2 three dimensional coordinates
		
		let distance = getDistanceXZ(player, entity);
		if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${distance}\nPlayer Tags: ${player.getTags()}`);
		const entityVelocity = entity.getVelocity();
		
		distance -= 1;
		if(distance - hVelocity(entity) / 1.5 > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && (entityVelocity.x + entityVelocity.z) / 2 < 1.5 || distance > 4.1 && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && !player.hasTag("moving") && getSpeed(player) === 0 && hVelocity(player) === 0) {

			
			if(!player.hasTag("gmc")) {
				
				flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`, false);
				
			}
		}
	}
}