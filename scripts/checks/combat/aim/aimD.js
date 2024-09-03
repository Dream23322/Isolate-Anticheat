import * as Minecraft from "@minecraft/server";
import { flag, getScore, setScore } from "../../../util";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/mathUtil.js";
import { fastAbs } from "../../../utils/fastMath.js";

const data = new Map();
const datatwo = new Map();
export function aim_d(player) {
    if(config.modules.aimD.enabled) {
   
        
        const currentRot = player.getRotation();
        const d = data.get(player.name) ?? (new Array(5)).fill(0);
        const dtwo = datatwo.get(player.name) ?? (new Array(5)).fill(0);
        
        if(d && dtwo) {
            const asList = arrayToList(d);
            const asList2 = arrayToList(dtwo);
            const isInvalid = (
                fastAbs(getAverageDifference(asList)) < 0.3 &&
                fastAbs(getAverageDifference(asList2)) > 5 
            )
            setScore(player, "aimDReset", getScore(player, "aimDReset", 0) + 1);
            if(isInvalid) {
                setScore(player, "aimDBuffer", getScore(player, "aimDBuffer", 0) + 1);
            }
            if(getScore(player, "aimDReset", 0) > 20) {
                const getPercent = getScore(player, "aimDBuffer", 0) / 20 * 100;
                if(getScore(player, "aimDBuffer", 0) >= 12) {
                    
                    flag(player, "Aim", "D", "Combat (Beta)", "data", `${getAverageDifference(asList)}, ${getAverageDifference(asList2)}, ${getPercent}`, true);
                }
                if(player.hasTag("aimDDebug")) player.runCommandAsync(`tell @a ${getScore(player, "aimDBuffer", 0)}, ${getScore(player, "aimDReset", 0)}, ${getPercent}`);
                setScore(player, "aimDBuffer", 0);
                setScore(player, "aimDReset", 0);
            }
            d.unshift(currentRot.x);
            dtwo.unshift(currentRot.y);

            d.pop();
            dtwo.pop();
        }

        data.set(player.name, d);
        datatwo.set(player.name, dtwo);
    }
}