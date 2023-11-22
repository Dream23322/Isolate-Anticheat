import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { hVelocity, getSpeed } from "../../../utils/mathUtil.js";

export function scaffold_b(player) {
    const rotation = player.getRotation()
    // Scaffold/B = Checks for a certain head rotation that horion clients scaffold uses (with bypass mode on), the rotation bypasses scaffold/C so that is why this is here
    if(config.modules.scaffoldB.enabled) {
        //const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
        if(!player.isFlying) {
            const clientRotations = [46.596282958984375, 46.59794616699219, 46.598968505859375, 46.5970458984375, 46.60420227050781, 46.605743408203125, 46.599029541015625, 46.609466552734375, 46.60064697265625, 46.597686767578125, -85];
            if(!player.hasTag("trident")) {
                if(rotation.x === 60 || rotation.x === 77.68765258789062 || rotation.x === 77.68768310546875 || rotation.x === 77.68777465820312 || rotation.x === 77.68795776367188 || clientRotations.includes(rotation.x)) {
            
                    flag(player, "Scaffold", "B", "Placement", "rotation", rotation.x, false);	
                    
                }
            }
        }	
    }
}