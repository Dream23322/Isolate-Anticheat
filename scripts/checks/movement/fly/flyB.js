import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
/*
Fly/B 
Flight Check - Checks for fly cheats

Fly/B Checks for patterns in a players y velocity

*/

export function fly_b(player) {
    if(config.modules.flyB.enabled) {
        return;
    }
}