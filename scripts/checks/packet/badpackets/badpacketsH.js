import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_h(player) {
    // Permission Spoof, so if someone is flying but doesnt have permission to fly
    if(config.modules.badpacketsH.enabled && player.isFlying && (!player.hasTag("op"))) {
        flag(player, "BadPackets","H", "Permision", "isFlying", "true", true);
        player.runCommandAsync(`ability "${player.name}" mayfly false`);
        setTitle(player, "Flying is not enabled", "Please turn it off");
    }
}