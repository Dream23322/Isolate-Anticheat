import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function sprint_a(player) {
    if(config.generalModules.sprint) {
        // invalidsprint/a = checks for sprinting with the blindness effect
        if(config.modules.invalidsprintA.enabled && player.getEffect("blindness") && player.isSprinting)
            flag(player, "InvalidSprint", "A", "Movement", undefined, undefined, true);
    }
}