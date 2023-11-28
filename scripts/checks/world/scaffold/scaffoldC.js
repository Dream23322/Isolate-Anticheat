import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { angleCalc } from "../../../utils/mathUtil.js";

export function scaffold_c(player, block) {
    const rotation = player.getRotation();
    const playerVelocity = player.getVelocity();
    // Scaffold/C = Checks for not looking where you are placing, it has measures in place to not false with the dumb bedrock bridinging mechanics.
    if(config.modules.scaffoldC.enabled === true) {
        
        const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
        if(!player.isFlying && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
            // The actual check
            
            if(!player.hasTag("right") && !player.hasTag("trident") && !player.isJumping && !player.hasTag("jump") && playerVelocity.y < 0.1) {
                if(rotation.x < config.modules.scaffoldC.angle) {
                    flag(player, "Scaffold", "C", "World", "invalidKeypress", `!right,angle=${rotation.x}`, false);
                }
            }   
        }
    }
}