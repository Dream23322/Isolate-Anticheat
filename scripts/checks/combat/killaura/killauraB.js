import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function killaura_b(player, system) {
	/**
	 * Killaura/B = Check for no swing (scythe check)
	 * For this check to work correctly Isolate has to be put at the top of the behavior packs list
	 * Players with the haste effect are excluded as the effect can make players not swing their hand
	 */
	if(config.modules.killauraB.enabled && !player.hasTag("trident") && !player.getEffect("haste")) {
		system.runTimeout(() => {
			const swingDelay = Date.now() - player.lastLeftClick;

			if(swingDelay > config.modules.killauraB.max_swing_delay) {
				flag(player, "Killaura", "B", "Combat", `swingDelay=${swingDelay}`);
			}
		}, config.modules.killauraB.wait_ticks);
	}
}