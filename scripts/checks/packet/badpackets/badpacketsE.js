import { getScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const lastPacket = new Map();
export function badpackets_e(player) {
    if(!allowedPlatform(player, config.modules.badpacketsE.AP)) return; 
    if(lastPacket.has(player.name) && config.modules.badpacketsE.enabled) {
        if(getScore(player, "packets", 0) > config.modules.badpacketsE.min_packets && lastPacket.get(player.name) === 0) {
            flag(player, "BadPackets", "E", "Packet", "packets", getScore(player, "packets", 0), false);
        }
    }
    lastPacket.set(player.name, getScore(player, "packets", 0));
}