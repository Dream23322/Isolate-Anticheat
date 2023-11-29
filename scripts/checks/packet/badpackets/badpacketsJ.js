import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
/*
 @idk-commits - Make a check that looks if a player has the onGround value but air is below them.
 If you need, help ask
*/
export function badpackets_j(player, block_under) {
    if(config.modules.badpacketsJ.enabled){
        if(player.isonGround && block_under.typeId.includes("air")){
            flag(player, "BadPackets", "J", "Packet", "blockUnder", block_under, false);
        }
    }

}