import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function killaura_c(player, entity, entitiesHit) {
	if(!allowedPlatform(player, config.modules.killauraC.AP)) return;

	// Multi Aura check
	if(config.modules.killauraC.enabled && !entitiesHit.includes(entity.id)) {
		entitiesHit.push(entity.id);

		if(entitiesHit.length >= config.modules.killauraC.entities) {
			flag(player, "KillAura", "C", "Combat", "entitiesHit", `${entitiesHit.length}`, false);
		}
	}
}