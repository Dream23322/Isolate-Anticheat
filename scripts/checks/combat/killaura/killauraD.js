import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { getScore } from "../../../util";

export function killaura_d(player, entity) {
    if(config.modules.killauraD.enabled && !player.hasTag("sleeping")) {
        const rotation = player.getRotation()
        const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2));
        if(Math.abs(rotation.x) > 79 && distance > 3.5) {
            if(!player.hasTag("trident") && !player.hasTag("bow")) {
                flag(player, "Killaura", "D", "Combat", "angle", `${rotation.x},distance=${distance}`, false);
            }
        }
    }
}