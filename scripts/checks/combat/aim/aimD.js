import * as Minecraft from "@minecraft/server";
import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/maths/mathUtil.js";
import { amountDeltaPitch, amountDeltaYaw } from "./aimData.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { abs } from "../../../utils/maths/standardMath.js";

const data = new Map();
const datatwo = new Map();
export function aim_d(player) {
    if(!allowedPlatform(player, config.modules.aimD.AP)) return;
    if(config.modules.aimD.enabled) {
   
        
        const currentRot = player.getRotation();
        const d = amountDeltaPitch(player, 5);
        const dtwo = amountDeltaYaw(player, 5);
        
        if(d && dtwo) {
            const asList = d
            const asList2 = dtwo
            const isInvalid = (
                abs(getAverageDifference(asList)) < 0.3 &&
                abs(getAverageDifference(asList2)) > 5 
            )
            setScore(player, "aimDReset", getScore(player, "aimDReset", 0) + 1);
            if(isInvalid) {
                setScore(player, "aimDBuffer", getScore(player, "aimDBuffer", 0) + 1);
            }
            if(getScore(player, "aimDReset", 0) > 20 && (player.hasTag("attacking") || !config.modules.aimD.needHit)) {
                const getPercent = getScore(player, "aimDBuffer", 0) / 20 * 100;
                if(getScore(player, "aimDBuffer", 0) >= 12) {
                    
                    flag(player, "Aim", "D", "Combat (Beta)", "data", `${getAverageDifference(asList)}, ${getAverageDifference(asList2)}, ${getPercent}`, true);
                }
                if(player.hasTag("aimDDebug")) player.runCommandAsync(`tell @a ${getScore(player, "aimDBuffer", 0)}, ${getScore(player, "aimDReset", 0)}, ${getPercent}`);
                setScore(player, "aimDBuffer", 0);
                setScore(player, "aimDReset", 0);
            }

        }

    }
}