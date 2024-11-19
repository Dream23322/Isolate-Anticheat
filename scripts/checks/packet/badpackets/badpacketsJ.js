import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function badpackets_j(player) {
    if(!allowedPlatform(player, config.modules.badpacketsJ.AP)) return;
    if(config.modules.badpacketsJ.enabled && !player.hasTag("op")) {
        const playerDeviceType = player.clientSystemInfo.platformType;

        if(playerDeviceType === "Desktop") {
            if(player.hasTag("Mobile") || player.hasTag("Console")) {
                flag(player, "BadPackets", "J", "Misc", "CurrentDevice: " + playerDeviceType, "Switched", true);}

        } else if(playerDeviceType === "Mobile") {
            if(player.hasTag("Desktop") || player.hasTag("Console")) {
                flag(player, "BadPackets", "J", "Misc", "CurrentDevice: " + playerDeviceType, "Switched", true);}
        } else if(playerDeviceType === "Console") {
            if(player.hasTag("Desktop") || player.hasTag("Mobile")) {
                flag(player, "BadPackets", "J", "Misc", "CurrentDevice: " + playerDeviceType, "Switched", true);}
        }
    }
}