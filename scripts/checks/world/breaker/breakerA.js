import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";

export function scaffold_c(player, block) {
	if(config.modules.breakerA.enabled) {
        // Check if the block being broken is a bed
            if(block.typeId.includes("minecraft:bed")) {
                // Check the blocks around the player
                let isBreakingThroughBlock = false;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        for (let z = -1; z <= 1; z++) {
                            const blockAroundPlayer = dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
                            if (blockAroundPlayer.typeId !== "minecraft:air") {
                                isBreakingThroughBlock = true;
                                break;
                            }
                        }
                        if(isBreakingThroughBlock) break;
                    }
                    if(isBreakingThroughBlock) break;
                }
    
                if(isBreakingThroughBlock) {
                    // The player is breaking a bed through a block, flag for BedFucker
                    flag(player, "Breaker", "A", "Misc", "blocks between bed", "true", false);
                }
            }
        }
}