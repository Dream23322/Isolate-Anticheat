import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function badpackets_g(player) {
    if(!allowedPlatform(player, config.modules.badpacketsG.AP)) return;
    if(config.modules.badpacketsG.enabled && player.isGliding && !player.hasTag("elytra")) flag(player, "BadPackets", "G", "Packet", "packet", "glide", true);
}