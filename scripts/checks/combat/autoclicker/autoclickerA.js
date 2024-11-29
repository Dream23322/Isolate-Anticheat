import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const lastCPS = new Map();
export function autoclicker_a(player) {
    if(!allowedPlatform(player, config.modules.autoclickerA.AP)) return;
    if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        player.runCommandAsync(`tellraw @a[tag=seeCPS] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> §iCPS§r:§b ${player.cps.toFixed(4)}"}]}`);
        if(lastCPS.get(player.name)) {
            if(lastCPS.get(player.name) > config.modules.autoclickerA.maxCPS && player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);
        }
        lastCPS.set(player.name, player.cps);
    }
}