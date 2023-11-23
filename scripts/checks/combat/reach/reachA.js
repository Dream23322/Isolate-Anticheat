import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity } from "../../../utils/mathUtil.js";

export function reach_a(player, entity) {
	// reach/A = check if a player hits an entity more then 5.1 blocks away
	if((config.modules.reachA.enabled || config.generalModules.reach) && !player.hasTag("noreach")) {
		// get the difference between 2 three dimensional coordinates
		
		const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));
		if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${distance}`);
		const entityVelocity = entity.getVelocity();
		
		
		if(distance - hVelocity(entity) / 1.5 > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && (entityVelocity.x + entityVelocity.z) / 2 < 1.5 || distance > 4.1 && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && !player.hasTag("moving") && getSpeed(player) === 0 && hVelocity(player) === 0) {
			const checkGmc = world.getPlayers({
				excludeGameModes: [Minecraft.GameMode.creative],
				name: player.name
			});
			
			if([...checkGmc].length !== 0) {
				
				flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`, false);
				
			}
		}
	}
}