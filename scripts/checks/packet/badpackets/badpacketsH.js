import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

export function badpackets_h(player) {
    if(!allowedPlatform(player, config.modules.badpacketsH.AP)) return;
    // Permission Spoof, so if someone is flying but doesnt have permission to fly
    if(config.modules.badpacketsH.enabled && player.isFlying && (!player.hasTag("op"))) {
        flag(player, "BadPackets","H", "Permision", "isFlying", "true", true);
        player.runCommandAsync(`ability "${player.name}" mayfly false`);
        setTitle(player, "Flying is not enabled", "Please turn it off");
    }
}