import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";
import { angleCalc } from "../../../utils/mathUtil.js";
import { getBlocksBetween } from "../../../utils/mathUtil.js";
import { getScore, setScore } from "../../../util.js";
/*
Original Code from 4urxra
Recode (cleaner) from VIsual1mpact
https://github.com/Visual1mpact/
Then I found false flags in it and made it messy again lmao
*/
export function nuker_c(player, block, blockBreak, Minecraft) {
    let score = 0;
    const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
        { x: 0, y: 1, z: 0 }
    ];
    for (const dir of directions) {
        const pos = {
            x: block.location.x + dir.x,
            y: block.location.y + dir.y,
            z: block.location.z + dir.z
        };
        if (!getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId !== "minecraft:air")) {
            score++;
        }
        if(getBlocksBetween(pos, pos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:bed")) {
            let score2 = 0;
            for (const dir of directions) {
                const newPos = {
                    x: pos.x + dir.x,
                    y: pos.y + dir.y,
                    z: pos.z + dir.z                    
                };
                if(getBlocksBetween(newPos, newPos).some((blk) => player.dimension.getBlock(blk)?.typeId === "minecraft:air")) {
                    score2++;
                }
            }
            if(score2 === 0) {
                score--;
            }
        }
    }
    if (score === -1 && block.typeId === "minecraft:bed") {
        blockBreak.cancel;
        Minecraft.system.run(() => {
            flag(player, "Nuker", "C", "World", "score", score, false);
        });
        blockBreak.cancel;
    }
}