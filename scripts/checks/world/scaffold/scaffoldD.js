import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_d(player, block, lastPlacePitch) {
    const rotation = player.getRotation();
    if(config.modules.scaffoldD.enabled) {
        return;
    }
}