import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";

export function killaura_d(player, entity) {
    if(config.modules.killauraD.enabled) {
        // Check if the player who was attacked is full boxed.
        // TODO: Fix this shitbox lol
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
            for(const dir in locations) {
                const posX = entity.location.z;
                const posY = entity.location.y;
                const posZ = entity.location.x;

                const pos = {
                    x: posX + dir.x,
                    y: posY + dir.y,
                    z: posZ + dir.z
                };
                // If the position doesnt have air in it, add to the score
                if (getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
                    invalid++;
                }   
            }
            if(invalid == 10) {
                flag(player, "Killaura", "D", "Combat", "invalid", invalid, false);
            }
        }
    }
}