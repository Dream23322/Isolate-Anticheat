import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";

export function killaura_d(player, entity) {
    if(config.modules.killauraD.enabled) {
        // Check if the player who was attacked is full boxed.
        const playerlocaiton = player.location;
        const invalid = 0;
        const locations = [
            {x: 1, y: 0, z: 0},
            {x: -1, y: 0, z: 0},
            {x: 0, y: 0, z: 1},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 2, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 1, y: 1, z: 0},
            {x: -1, y: 1, z: 0},
            {x: 0, y: 1, z: 1},
            {x: 0, y: 1, z: -1}
        ];
        if(entity.typeId == "minecraft:player") {
            for(const pos in locations) {
                if(getBlocksBetween(playerlocaiton.add(locations[pos]), playerlocaiton.add(locations[pos])).some((block) => block.typeId !== "minecraft:air")) {
                    invalid += 1;
                }
            }
            if(invalid == 10) {
                flag(player, "Killaura", "D", "Combat", "invalid", invalid, false);
            }
        }
    }
}