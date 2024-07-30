import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";

export function speed_a(player) {
    const playerSpeed = getSpeed(player);
    // In speed/A we make sure we are still able to check players who have the speed effect! We do this by adding an estimate effect multiplier to the max speed.
    if(config.modules.speedA.enabled && hVelocity(player) > 0.05) {
    // Check if the player has an effect or not
    if(player.getEffect("speed")) {

        // Define everything that is needed
        const maxSpeed = config.modules.speedA.speed;
        const speedEffectValue = player.getEffect("speed").amplifier;
        let modifiedSpeed = maxSpeed; 
        
        // Add to the maxspeed value the corisponding amount
        for (let i = 0; i < speedEffectValue; i++) {
            // Add 0.3 to make sure there are no false flags
            modifiedSpeed += 0.3; 
        }

        // If the speed is higher than the max speed, flag the player for Speed/A
        if(playerSpeed > modifiedSpeed && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
            flag(player, "Speed", "A", "Movement", "speed", playerSpeed.toFixed(2), true);
        }
    } else {
        // If the player doesnt have the strict tag, be more tolerant
        if(!player.hasTag("strict")) {
            if(playerSpeed > config.modules.speedA.speed + 0.1 && !player.hasTag("strict") && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
                flag(player, "Speed", "A", "Movement", "speed", playerSpeed.toFixed(2), true);
            }
        
        } else {
            // If the player doesnt have the the strict tag, be lesss tolerant
            if(playerSpeed > config.modules.speedA.speed && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
                flag(player, "Speed", "A", "Movement", "speed", playerSpeed.toFixed(2), true);
            }
        }
    }
}  
}