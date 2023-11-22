import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_c(player, entity) {
	// badpackets[3] = checks if a player attacks themselves
	// some (bad) hacks use this to bypass anti-movement cheat checks
	if(config.modules.badpacketsC.enabled && entity.id === player.id) {
		flag(player, "BadPackets", "C", "Exploit");	
	}
}