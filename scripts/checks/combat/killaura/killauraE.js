import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { setScore } from "../../../util";

export function killaura_e(player, entity) {
    if(config.modules.killauraE.enabled) {
        if(entity.typeId === "isolate:killaura") {
            flag(player, "Killaura", "E", "Combat", "Attacking Bot", "true", false);
            setScore(player, "tick_counter", 290);
        }
    }
}