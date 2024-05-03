import * as Minecraft from "@minecraft/server";
import { flag, getScore } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil";

const data = new Map();
export function fly_d(player) {
    if(config.modules.flyD.enabled) {
        if(data.has(player.name)) {
            if(data.get(player.name).inAir && !data.get(player.name).isJumping && aroundAir(player) && player.isJumping) flag(player, "Fly", "D", "Movement", "jumping", "true", true);
        }
        data.set(player.name, {
            inAir: aroundAir(player),
            isJumping: player.isJumping
        })
    }
}