import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_g(player) {
    if(config.modules.badpacketsG.enabled) {
        if(player.isGliding && !player.hasTag("elytra")) {
            flag(player, "BadPackets", "G", "Packet", "packet", "glide", true);
        }
    }
}