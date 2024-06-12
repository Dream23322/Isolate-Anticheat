import { flag } from "../../../util";
import config from "../../../data/config.js";

export function tower_b(player, block) {
    const rotation = player.getRotation()
    // Tower/B = Checks for tower like yPos differences
    if(config.modules.towerB.enabled) {
        // get block under player
        if(
            !player.isFlying &&
            player.isJumping &&
            player.getVelocity().y < 1 &&
            player.fallDistance < 0 &&
            block.location.x === blockUnder?.location.x &&
            block.location.y === blockUnder?.location.y &&
            block.location.z === blockUnder?.location.z &&
            !player.getEffect("jump_boost") &&
            !block.typeId.includes("fence") &&
            !block.typeId.includes("wall") &&
            !block.typeId.includes("_shulker_box")
        ) {
            const yPosDiff = Math.abs(player.location.y % 1);
    
            if(yPosDiff > config.modules.towerB.max_y_pos_diff && !player.hasTag("gmc") && !player.hasTag("flying")) {
                flag(player, "Tower", "B", "World", `yPosDiff=${yPosDiff},block=${block.typeId}`, true);
                block.setType("air");
            }
        }
    }
}