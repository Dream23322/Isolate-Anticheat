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
}