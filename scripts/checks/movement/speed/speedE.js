import { flag } from "../../../util";
import config from "../../../data/config";
import { playerTellraw } from "../../../utils/gameUtil";
import { arrayToList, getAverage } from "../../../utils/mathUtil";
import { fastAbs } from "../../../utils/fastMath";
import { allowedPlatform } from "../../../utils/platformUtils.js";
// fix the issue with bpt calc use pythag
const data = new Map();
const data2 = new Map();
export function speed_e(player) {
    if(!allowedPlatform(player, config.modules.speedE.AP)) return;
    
    if(config.modules.speedE.enabled) {
        if(data2.get(player.name)) {
            const current_pos = {x: player.location.x, y: player.location.y, z: player.location.z};
            const prev_pos = {x: data2.get(player.name).x, y: data2.get(player.name).y, z: data2.get(player.name).z} || { x: player.location.x, y: player.location.y, z: player.location.z };
            const bptDiff = fastAbs(((current_pos.x - prev_pos.x) + (current_pos.z - prev_pos.z)) / 2);
            const d = data.get(player.name) ?? (new Array(29)).fill(0);
            if(d) {
                if(bptDiff > 2 || player.getEffect("speed")) {
                    data.set(player.name, (new Array(29)).fill(0));
                    //console.warn("bypassed");
                    data2.set(player.name, {
                        x: player.location.x,
                        y: player.location.y,
                        z: player.location.z
                    });
                    return player.addTag("speedE_pass");
                }
                const valueList = arrayToList(d);
                valueList.push(bptDiff);
                const average = fastAbs(getAverage(valueList));
                if(average > config.modules.speedE.bpt && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("speedE_pass") && !player.hasTag("placing") && !player.hasTag("teleport") && (average * 20).toFixed(2) < config.modules.speedE.maxPredict && !player.hasTag("elytra")) {
                    flag(player, "Speed", "E", "Movement", "avg_bpt", `${average.toFixed(2)},predict_bps=${(average * 20).toFixed(2)}`, true);
                }
                d.unshift(bptDiff);
                d.pop();
                player.removeTag("speedE_pass");
            }
            data.set(player.name, d);
        }
        data2.set(player.name, {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z
        });
    }

}

