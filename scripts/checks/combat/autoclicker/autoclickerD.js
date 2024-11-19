import { flag, setScore, getScore } from "../../../util";
import config from "../../../data/config.js";
import { getOutliersInt } from "../../../utils/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
export function autoclicker_d(player) {
    if(!allowedPlatform(player, config.modules.autoclickerD.AP)) return;
    if(config.modules.autoclickerD.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerD.checkCPSAfter) {
        player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
        if(data.get(player.name)) {
            const dat = data.get(player.name);
            const minCPS = config.modules.autoclickerD.minCPS;
            if(dat.one > minCPS && dat.two > minCPS && dat.three > minCPS && dat.four > minCPS && player.cps > minCPS && dat.five > minCPS) {
                const outliersCheck = getOutliersInt([player.cps, dat.one, dat.two, dat.three, dat.four, dat.five], 2);
                if(outliersCheck >= 2) {
                    // Buffer system
                    const currentBuff = getScore(player, "autoclickerD_buffer", 0);
                    setScore(player, "autoclickerD_buffer", currentBuff + 1);
                    if(currentBuff + 1 >= config.modules.autoclickerD.buffer) {
                        flag(player, "AutoClicker", "D", "Combat (BETA)", "Outliers", `${outliersCheck},CPS=${player.cps},buffer=${currentBuff}`, true);
                        setScore(player, "autoclickerD_buffer", 0);
                    }
                }
            }
        }
        data.set(player.name, {
            one: player.cps,
            two: data.get(player.name)?.one || 0,
            three: data.get(player.name)?.two || 0,
            four: data.get(player.name)?.three || 0,
            five: data.get(player.name)?.four || 0
        });
    }
}