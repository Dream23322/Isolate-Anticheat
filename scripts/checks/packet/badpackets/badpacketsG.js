import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_g(player) {
    // BadPackets/G = Checks for invalid actions
    // So like if someone attacks while placing a block, or if someone breaks and places a block, not possible!
    if(config.modules.badpacketsG.enabled) {
        if(player.hasTag("placing") && player.hasTag("attacking")) {
            flag(player, "BadPackets", "G", "Packet", "actions", "Placement, Attacking", false);
        }
        if(player.hasTag("placing") && player.hasTag("breaking") && !player.hasTag("snow") && !player.hasTag("gmc")) {
            flag(player, "BadPackets", "G", "Packet", "actions", "Placement, Breaking", false);
        }
        if (player.hasTag("attacking") && player.hasTag("breaking")) {
            flag(player, "BadPackets", "G", "Packet", "actions", "Breaking, Attacking", false);
        }
        if(player.hasTag("usingItem") && (player.hasTag("attacking") || player.hasTag("placing") || player.hasTag("breaking"))) {
            flag(player, "BadPackets", "G", "Packet", "actions", "ItemUse, Attacking", false);
        }

        
    }
}