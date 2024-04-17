import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_b(player) {
    const rotation = player.getRotation()
    // Scaffold/B = Checks for a certain head rotation that horion clients scaffold uses (with bypass mode on), the rotation bypasses scaffold/C so that is why this is here
    if(config.modules.scaffoldB.enabled) {
        if(rotation.x === 60 || rotation.x === -85) {
            flag(player, "Scaffold", "B", "World", "rotation", rotation.x, false);	
        }
    }
}