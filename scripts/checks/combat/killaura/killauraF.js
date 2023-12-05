import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
import { aroundAir } from "../../../utils/gameUtil.js";
import { getScore, setScore } from "../../../util";
import { angleCalc } from "../../../utils/mathUtil.js";

export function killaura_f(player, entity) {
    if(config.modules.killauraF.enabled) {
        // Havent tested this yet but it should be able to detect horion client
        if(angleCalc(player, entity) < 1) {
            setScore(player, "killauraF_buffer", getScore(player, "killauraF_buffer", 0) + 1);
        }
        setScore(player, "killauraF_reset", getScore(player, "killauraF_reset", 0) + 1);
        if(getScore(player, "killauraF_reset", 0) > 30) {
            
            setScore(player, "killauraF_reset", 0);
            if(getScore(player, "killauraF_buffer", 0) > 10) {
                
                flag(player, "Killaura", "F", "Combat", "accuracy", getScore(player, "killauraF_buffer", 0), false);	
                setScore(player, "killauraF_buffer", 0);
            }
            setScore(player, "killauraF_buffer", 0);
        }
    }  
}