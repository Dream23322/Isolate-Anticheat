import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs } from "../../../utils/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const lastCPS = new Map();
export function autoclicker_b(player) {
    if(!allowedPlatform(player, config.modules.autoclickerB.AP)) return;
    if(config.modules.autoclickerB.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerB.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        if(lastCPS.get(player.name)) {
            const oldCPS = lastCPS.get(player.name)?.old;
            const newCPS = lastCPS.get(player.name)?.new;
            if(oldCPS && player.cps > config.modules.autoclickerB.minCPS) {
                const averageDif = fastAbs(fastAbs(player.cps - newCPS) + fastAbs(oldCPS - newCPS)) / 2;
                if(averageDif < config.modules.autoclickerB.maxDeviation) flag(player, "Autoclicker", "B", "Combat", "AVG_DIFF", averageDif);
            }
        }
        lastCPS.set(player.name, {
            new: player.cps,    
            old: lastCPS.get(player.name)?.new || 0
        });
    }
}