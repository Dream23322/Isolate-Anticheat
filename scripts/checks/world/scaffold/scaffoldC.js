import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";

export function scaffold_c(player, block) {
    // TODO: Rewrite, check for not holding the block the user placed.
    if(config.modules.scaffoldC.enabled) {
        // Get what item the player is holding
        const container = player.getComponent("inventory")?.container;
        const selectedSlot = player.selectedSlot;
        const item = container.getItem(selectedSlot);
        try {
            if(item.typeId !== block.typeId) {
                flag(player, "Scaffold", "C", "Placement", "item", item.typeId, false);
            }
        } catch (e) {
            flag(player, "Scaffold", "C", "Placement", "item", "nothing!", false);
        }
    }
}