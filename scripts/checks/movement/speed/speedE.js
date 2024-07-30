import { flag } from "../../../util";
import config from "../../../data/config";
const data = new Map();
const data2 = new Map();
export function speed_e(player) {
    if(config.modules.speedE.enabled) {
        if(data2.get(player.name)) {
            const current_pos = {x: player.location.x, y: player.location.y, z: player.location.z};
            const prev_pos = {x: data2.get(player.name).x, y: data2.get(player.name).y, z: data2.get(player.name).z} || { x: player.location.x, y: player.location.y, z: player.location.z };
            const bptDiff = Math.abs(((current_pos.x - prev_pos.x) + (current_pos.z - prev_pos.z)) / 2);
            const d = data.get(player.name) ?? {};
            if(d) {
                if(bptDiff > 2 || player.getEffect("speed")) {
                    data.clear(player.name);
                    return player.addTag("speedE_pass");
                }
                // Check if the average bpt is greater than config.modules.speedE.bpt
                const average = Math.abs((d.one + d.two + d.three + d.four + d.five + d.six + d.seven + d.eight + d.nine + d.ten + d.eleven + d.twelve + d.thirteen + d.fourteen + d.fifteen + d.sixteen + d.seventeen + d.eighteen + d.nineteen + d.twenty + d.twentyOne + d.twentyTwo + d.twentyThree + d.twentyFour + d.twentyFive + d.twentySix + d.twentySeven + d.twentyEight + d.twentyNine + d.thirty) / 30);
            
                if(average > config.modules.speedE.bpt && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("speedE_pass") && !player.hasTag("placing") && !player.hasTag("teleport") && (average * 20).toFixed(2) < config.modules.speedE.maxPredict) {
                    flag(player, "Speed", "E", "Movement", "avg_bpt", `${average.toFixed(2)},predict_bps=${(average * 20).toFixed(2)}`, true);
                }
            }
            data.set(player.name, {
                one: bptDiff,
                two: d.one || 0,
                three: d.two || 0,
                four: d.three || 0,
                five: d.four || 0,
                six: d.five || 0,
                seven: d.six || 0,
                eight: d.seven || 0,
                nine: d.eight || 0,
                ten: d.nine || 0,
                eleven: d.ten || 0,
                twelve: d.eleven || 0,
                thirteen: d.twelve || 0,
                fourteen: d.thirteen || 0,
                fifteen: d.fourteen || 0,
                sixteen: d.fifteen || 0,
                seventeen: d.sixteen || 0,
                eighteen: d.seventeen || 0,
                nineteen: d.eighteen || 0,
                twenty: d.nineteen || 0,
                twentyOne: d.twenty || 0,
                twentyTwo: d.twentyOne || 0,
                twentyThree: d.twentyTwo || 0,
                twentyFour: d.twentyThree || 0,
                twentyFive: d.twentyFour || 0,
                twentySix: d.twentyFive || 0,
                twentySeven: d.twentySix || 0,
                twentyEight: d.twentySeven || 0,
                twentyNine: d.twentyEight || 0,
                thirty: d.twentyNine || 0
            });
        }
        data2.set(player.name, {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z
        });
    }

}

