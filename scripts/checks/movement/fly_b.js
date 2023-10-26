import config from "./data/config.js";
const oldx = new Map();
const oldz = new Map();
const oldoldx = new Map();
const oldoldz = new Map();
export function fly_b(player) {
    if(config.modules.flyB.enabled) {
        if (config.modules.flyB.enabled && !player.hasTag("op") && !player.isFlying && !player.isOnGround && !player.isJumping && !player.hasTag("nofly") && (!player.hasTag("damaged") || !player.hasTag("fall_damage")) && !player.isGliding && !player.getEffect("speed") &&!player.getEffect("slow_falling")) {
            // Checks for invalid downwards accelerations
            /*
                This is a mix of a bunch o different stuffs because too much random stuff spread out is
                1. Annoying to understand and handle
                2. Can cause performance issues with the server
            */
            // Get all data
            const oldxp = oldx.get(player) || 0;
            const oldzp = oldz.get(player) || 0;
            const oldoldxp = oldoldx.get(player) || 0;
            const oldoldzp = oldoldz.get(player) || 0;

            // We calculate 2 diffferences so that we can compare the 2
            const diff1 = Math.abs(oldoldxp - oldxp);
            const diff2 = Math.abs(oldoldzp - oldzp);
            const diff3 = Math.abs(oldxp - player.location.x);
            const diff4 = Math.abs(oldzp - player.location.z);

            // Calculate the final differences
            const final1 = Math.abs(diff1 - diff2) / 2;
            const final2 = Math.abs(diff3 - diff4) / 2;

            // If the differences are the same, flag for fly/B
            
            if (final1 === final2 && final2 !== 0) {
                // if the player is in Air, continue to flag
                if(aroundAir(player)) {
                    flag(player, "Fly", "B", "Movement", "difference", final1, false);
                }
            }

            // If the player is above world height, flag
            if(aroundAir(player) && player.location.y > 319 && !player.isOnGround && !player.hasTag("elytra")) {
                flag(player, "Fly", "B", "Movement", "y", player.location.y, false);
                player.teleport({x: player.location.x, y: player.location.y -150, z: player.location.z});
            }

            // Update all maps if the player is in air
            if(aroundAir(player) && !player.isOnGround) {
                oldx.set(player, player.location.x);
                oldz.set(player, player.location.z);
                oldoldx.set(player, oldxp);
                oldoldz.set(player, oldzp);
            }
        }
    }
}