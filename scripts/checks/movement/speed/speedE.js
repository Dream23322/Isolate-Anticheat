import { flag } from "../../../util";
import config from "../../../data/config";
import { playerTellraw } from "../../../utils/gameUtil";
const data = new Map();
const data2 = new Map();
export function speed_e(player) {
    if(config.modules.speedE.enabled) {
        if(data2.get(player.name)) {
            const current_pos = {x: player.location.x, y: player.location.y, z: player.location.z};
            const prev_pos = {x: data2.get(player.name).x, y: data2.get(player.name).y, z: data2.get(player.name).z} || { x: player.location.x, y: player.location.y, z: player.location.z };
            const bptDiff = Math.abs(((current_pos.x - prev_pos.x) + (current_pos.z - prev_pos.z)) / 2);
            const d = data.get(player.name) ?? (new Array(29)).fill(0);
            if(d) {
                if(bptDiff > 2 || player.getEffect("speed")) {
                    // Clear the array of data
                    data.set(player.name, (new Array(29)).fill(0));
                    return player.addTag("speedE_pass");
                }
                // Check if the average bpt is greater than config.modules.speedE.bpt
                const average = Math.abs((bptDiff + d[0] + d[1] + d[2] + d[3] + d[4] + d[5] + d[6] + d[7] + d[8] + d[9] + d[10] + d[11] + d[12] + d[13] + d[14] + d[15] + d[16] + d[17] + d[18] + d[19] + d[20] + d[21] + d[22] + d[23] + d[24] + d[25] + d[26] + d[27] + d[28]) / 30);
                if(average > config.modules.speedE.bpt && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("speedE_pass") && !player.hasTag("placing") && !player.hasTag("teleport") && (average * 20).toFixed(2) < config.modules.speedE.maxPredict && !player.hasTag("elytra")) {
                    flag(player, "Speed", "E", "Movement", "avg_bpt", `${average.toFixed(2)},predict_bps=${(average * 20).toFixed(2)}`, true);
                }
                d.unshift(bptDiff);
                d.pop();
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

