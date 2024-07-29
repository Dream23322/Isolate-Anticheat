import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
export function killaura_c(player, entity, entitiesHit) {

	// Multi Aura check
	if(config.modules.killauraC.enabled && !entitiesHit.includes(entity.id)) {
		entitiesHit.push(entity.id);

		if(entitiesHit.length >= config.modules.killauraC.entities) {
			flag(player, "KillAura", "C", "Combat", "entitiesHit", `${entitiesHit.length}`, false);
		}
	}

	// Switch Aura check
	if(config.modules.killauraC.enabled) {
		if(data.get(player.name)) {
			const rotation = player.getRotation();
			const lastRot = data.get(player.name).one;
			const lastRot2 = data.get(player.name)?.two || 0;
			const lastRot3 = data.get(player.name)?.three || 0;

			if(lastRot2 == 0) return;
			if(lastRot3 == 0) return;
			
			const diff1 = Math.abs(rotation.x - lastRot);
			const diff2 = Math.abs(rotation.x - lastRot2);
			const diff3 = Math.abs(lastRot - lastRot2);

			const badRots = (
				diff1 > 90 &&
				(diff2 < 15 || diff3 < 15) &&
				diff3 > 80
			)
			if(badRots) flag(player, "Killaura", "C", "Combat", "rotationData", `${diff1},${diff2},${diff3}`, false);
		}
		data.set(player.name, {
			one: player.getRotation().x,
			two: data.get(player.name)?.one || 0,
			three: data.get(player.name)?.two || 0
		})
	}
}