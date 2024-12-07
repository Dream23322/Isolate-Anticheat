import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { arrayToList, getAverageDifference } from "../../../utils/maths/mathUtil.js";
import { fastAbs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
const data = new Map();
const data2 = new Map();

export function tower_b(player, block) {
    if(!allowedPlatform(player, config.modules.towerB.AP)) return;
    if(config.modules.towerB.enabled) {
        const isPlaceBelow = block.location.y < player.location.y;

        const d = data.get(player.name) ?? (new Array(5)).fill(0);
        const d2 = data2.get(player.name) ?? null;
        if(d && d2 != null) {
            const isTower = isPlaceBelow && block.location.x === d2.x && block.location.z === d2.z && block.location.y > d2.y;

            const dataList = arrayToList(d);
            const averageVelocity = isomath.abs(getAverageDifference(dataList));
            // If the player has the tag "strict" minus 0.2 from the velocity amount in the config
            const maxVelocity = (
                player.hasTag("strict") ? config.modules.towerB.velocity - 0.2 : config.modules.towerB.velocity
            )

            if(isTower && averageVelocity > maxVelocity) {
                flag(player, "Tower", "B", "Placement", "data", `${averageVelocity.toFixed(5)}`, true);
            }
            d.unshift(player.getVelocity().y);
            d.pop();
        }

        data.set(player.name, d);
        data2.set(player.name, {
            x: block.location.x,
            y: block.location.y,
            z: block.location.z
        });
    }
}