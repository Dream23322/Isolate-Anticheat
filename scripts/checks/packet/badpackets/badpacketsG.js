import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_g(player) {
    // BadPackets/G = Checks for invalid actions
    // So like if someone attacks while placing a block, or if someone breaks and places a block, not possible!
    if(config.modules.badpacketsG.enabled) {
        return;    
    }
}