import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
const lastCPS = new Map();
export function autoclicker_a(player) {
    if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        if(lastCPS.get(player.name)) {
            if(lastCPS.get(player.name) > config.modules.autoclickerA.maxCPS && player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);
        }
        lastCPS.set(player.name, player.cps);
    }
}