import { getScore, setScore } from "../../../util";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { fastAbs, fastRound } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { getDeltaPitch, getDeltaYaw } from "./aimData.js";

const data = new Map();

export function aim_h(player) {
    return;
    if(config.modules.aimH.enabled) {
        if(!allowedPlatform(player, config.modules.aimH.AP)) return;

        // Define variables
        const rot = player.getRotation();
        const deltaYaw = getDeltaYaw(player);
        const deltaPitch = getDeltaPitch(player);
        

    }
}