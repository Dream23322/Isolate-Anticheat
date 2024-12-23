import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getScore } from "../../../util";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function killaura_b(player, system, entity) {
	if(!allowedPlatform(player, config.modules.killauraB.AP)) return;
	/**
	 * Killaura/B = Checks for invalid hits
	 */
	// Checks for invalid packet (no swing)
	if(config.modules.killauraB.enabled && !player.hasTag("trident") && !player.getEffect("haste")) {
		system.runTimeout(() => {
			const swingDelay = Date.now() - player.lastLeftClick;

			if(swingDelay > config.modules.killauraB.max_swing_delay) {
				flag(player, "Killaura", "B", "Combat", `swingDelay=${swingDelay}`, true);
			}
		}, config.modules.killauraB.wait_ticks);
	}
	// Checks for hitting while using an item
    const rightTicks = getScore(player, "right");
	if(config.modules.killauraB.enabled && player.hasTag("right") && rightTicks > config.modules.killauraB.rightTicks) {
        flag(player, "Killaura", "B", "Combat", `ticks=${rightTicks}`, true);
    }

	// Check for hitting an invalid entity
	if(config.modules.killauraB.enabled) {
		const entityID = entity.typeId;
		const invalid = entityID === "minecraft:xp_orb" || entity.ID === "minecraft:item";
		if(invalid) flag(player, "Killaura", "B", "Combat", "entity", entityID, true);
	}
}