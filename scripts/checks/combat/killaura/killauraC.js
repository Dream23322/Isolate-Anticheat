import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function killaura_c(player, entity, entityHit) {
    if(config.modules.killauraC.enabled && !player.entitiesHit.includes(entity.id)) 
        player.entitiesHit.push(entity.id);
        if(player.entitiesHit.length >= config.modules.killauraC.entities) {
            flag(player, "KillAura", "C", "Combat", "entitiesHit", player.entitiesHit.length, true);
            player.addTag("strict");
        }
}