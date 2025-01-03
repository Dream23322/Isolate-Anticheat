import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getScore, setScore } from "../../../util";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
// Why do I still have this?
export function killaura_f(player, value) {
    if(!allowedPlatform(player, config.modules.killauraF.AP)) return;
    if(config.modules.killauraF.enabled) {
        // Setup Variables
        const miss = getScore(player, "ka_F_misses", 0);
        const hit = getScore(player, "ka_F_hits", 0);
        let reset = getScore(player, "killauraF_reset", 0);
        if(value === 0) {
            setScore(player, "ka_F_misses", miss + 1);
        } else if(value === 1) {
            setScore(player, "ka_F_hits", hit + 1);
        }
        setScore(player, "killauraF_reset", reset + 1);
        if(reset >= 100 && getSpeed(player) > 0.1) {
            // If the player hits above config amount, flag
            if(getScore(player, "ka_F_hits", 0) > config.modules.killauraF.hits) {
                flag(player, "Killaura", "F", "Combat (BETA)", "hits", `${getScore(player, "ka_F_hits", 0)}`, true);
            }
            if(player.hasTag("debug")) console.warn(`Data || Hits: ${getScore(player, "ka_F_hits", 0)} | Misses: ${getScore(player, "ka_F_misses", 0)} | Reset: ${getScore(player, "killauraF_reset", 0)}`);
            // Reset the score
            setScore(player, "ka_F_hits", 0);
            setScore(player, "ka_F_misses", 0);
            setScore(player, "killauraF_reset", 0);
        }
    }  
}