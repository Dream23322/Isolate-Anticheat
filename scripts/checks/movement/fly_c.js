import config from "./data/config.js";

export function fly_c(player) {
    if(config.modules.flyC.enabled && player.fallDistance < config.modules.flyC.fallDistance && !player.hasTag("trident") && !player.hasTag("ground") && !player.hasTag("nofly") &&  (!player.hasTag("damaged") || !player.hasTag("fall_damage")) && player.hasTag("strict") && !player.hasTag("slime")) {
        // Stopping false flags
        if(!player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag("jump") && !player.hasTag("op")) {
            
            if(aroundAir(player) === true && Math.abs(playerVelocity.y) > 0.1) {
                flag(player, "Fly", "C", "Movement", "fallDistance", player.fallDistance, false);
            }	
        }
    }	
}