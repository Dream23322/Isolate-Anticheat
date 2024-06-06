import { flag, debug } from "../../../util";
import config from "../../../data/config";
import { hVelocity } from "../../../utils/mathUtil";
const data = new Map();
const data2 = new Map();
export function speed_e(player) {
    if(config.modules.speedE.enabled) {
        if(data2.get(player.name)) {
            const current_pos = {x: player.location.x, y: player.location.y, z: player.location.z};
            const prev_pos = {x: data2.get(player.name).x, y: data2.get(player.name).y, z: data2.get(player.name).z} || { x: player.location.x, y: player.location.y, z: player.location.z };
            const bptDiff = Math.abs(((current_pos.x - prev_pos.x) + (current_pos.z - prev_pos.z)) / 2);
            
            if(data.get(player.name)) {
                if(bptDiff > 2 || player.getEffect("speed")) {
                    data.clear(player.name);
                    return player.addTag("speedE_pass");
                }
                // Check if the average bpt is greater than config.modules.speedE.bpt
                const d = data.get(player.name);
                const average = Math.abs((d.one + d.two + d.three + d.four + d.five + d.six + d.seven + d.eight + d.nine + d.ten + d.eleven + d.twelve + d.thirteen + d.fourteen + d.fifteen + d.sixteen + d.seventeen + d.eighteen + d.nineteen + d.twenty + d.twentyOne + d.twentyTwo + d.twentyThree + d.twentyFour + d.twentyFive + d.twentySix + d.twentySeven + d.twentyEight + d.twentyNine + d.thirty) / 30);
            
                if(average > config.modules.speedE.bpt && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("speedE_pass") && !player.hasTag("placing")) {
                    flag(player, "Speed", "E", "Movement", "avg_bpt", `${average.toFixed(2)},predict_bps=${(average * 20).toFixed(2)}`, true);
                }
            }
            data.set(player.name, {
                one: bptDiff,
                two: data.get(player.name)?.one || 0,
                three: data.get(player.name)?.two || 0,
                four: data.get(player.name)?.three || 0,
                five: data.get(player.name)?.four || 0,
                six: data.get(player.name)?.five || 0,
                seven: data.get(player.name)?.six || 0,
                eight: data.get(player.name)?.seven || 0,
                nine: data.get(player.name)?.eight || 0,
                ten: data.get(player.name)?.nine || 0,
                eleven: data.get(player.name)?.ten || 0,
                twelve: data.get(player.name)?.eleven || 0,
                thirteen: data.get(player.name)?.twelve || 0,
                fourteen: data.get(player.name)?.thirteen || 0,
                fifteen: data.get(player.name)?.fourteen || 0,
                sixteen: data.get(player.name)?.fifteen || 0,
                seventeen: data.get(player.name)?.sixteen || 0,
                eighteen: data.get(player.name)?.seventeen || 0,
                nineteen: data.get(player.name)?.eighteen || 0,
                twenty: data.get(player.name)?.nineteen || 0,
                twentyOne: data.get(player.name)?.twenty || 0,
                twentyTwo: data.get(player.name)?.twentyOne || 0,
                twentyThree: data.get(player.name)?.twentyTwo || 0,
                twentyFour: data.get(player.name)?.twentyThree || 0,
                twentyFive: data.get(player.name)?.twentyFour || 0,
                twentySix: data.get(player.name)?.twentyFive || 0,
                twentySeven: data.get(player.name)?.twentySix || 0,
                twentyEight: data.get(player.name)?.twentySeven || 0,
                twentyNine: data.get(player.name)?.twentyEight || 0,
                thirty: data.get(player.name)?.twentyNine || 0
            });
        }
        data2.set(player.name, {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z
        });
    }

}

