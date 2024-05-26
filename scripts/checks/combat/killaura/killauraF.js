import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { getScore, setScore } from "../../../util";
import { angleCalc, getSpeed } from "../../../utils/mathUtil.js";

const data = new Map();
export function killaura_f(player, value) {
    if(config.modules.killauraF.enabled) {
        // Setup Variables
        const miss = getScore(player, "ka_F_misses", 0);
        const hit = getScore(player, "ka_F_hits", 0);
        let reset = getScore(player, "killauraF_reset", 0);
        console.warn(value);
        if(value == 0) {
            setScore(player, "ka_F_misses", miss + 1);
        } else if(value == 1) {
            setScore(player, "ka_F_hits", hit + 1);
        }
        setScore(player, "killauraF_reset", reset + 1);
        if(reset >= 100 && getSpeed) {
            // If the player hits above config amount, flag
            if(getScore(player, "ka_F_hits", 0) > config.modules.killauraF.hits) {
                flag(player, "Killaura", "F", "Combat (BETA)", "hits", getScore(player, "ka_F_hits", 0), false);
            }
            console.warn(`Data || Hits: ${getScore(player, "ka_F_hits", 0)} | Misses: ${getScore(player, "ka_F_misses", 0)} | Reset: ${getScore(player, "killauraF_reset", 0)}`);
            // Reset the score
            setScore(player, "ka_F_hits", 0);
            setScore(player, "ka_F_misses", 0);
            setScore(player, "killauraF_reset", 0);
        }
    }  
}