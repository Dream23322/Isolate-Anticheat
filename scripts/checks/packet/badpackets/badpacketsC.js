import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_c(player, entity) {
	if(!allowedPlatform(player, config.modules.badpacketsC.AP)) return;
	// badpackets[3] = checks if a player attacks themselves
	// some (bad) hacks use this to bypass anti-movement cheat checks
	if(config.modules.badpacketsC.enabled && entity.id === player.id) {
		flag(player, "BadPackets", "C", "Exploit");	
	}
}