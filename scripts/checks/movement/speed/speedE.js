import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config";
import { playerTellraw } from "../../../utils/gameUtil";
import { arrayToList, getAverage } from "../../../utils/maths/mathUtil.js";
import { fastAbs, fastPow, fastSqrt } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";

const data = new Map();
const data2 = new Map();
export function speed_e(player) {
    if(!allowedPlatform(player, config.modules.speedE.AP)) return;
    
    if(config.modules.speedE.enabled) {
        if(data2.get(player.name)) {
            const current_pos = {x: fastAbs(player.location.x), y: fastAbs(player.location.y), z: fastAbs(player.location.z)};
            const prev_pos = {x: data2.get(player.name).x, y: data2.get(player.name).y, z: data2.get(player.name).z} || { x: player.location.x, y: player.location.y, z: player.location.z };
            const bptDiff = fastAbs(fastSqrt(fastPow(fastAbs(current_pos.x - prev_pos.x), 2) + fastPow(fastAbs(current_pos.z - prev_pos.z), 2)));
            const d = data.get(player.name) ?? (new Array(29)).fill(0);
            if(d) {
                // Calculate max BPT
                let maxBPT = config.modules.speedE.bpt // 0.271
                if(player.getEffect("slowness")) {
                    maxBPT -= (fastPow(player.getEffect("slowness").amplifier, 2) * 0.01);
                    if(maxBPT < 0.16 && player.isJumping) maxBPT = 0.22; 
                }
                if(player.getEffect("speed")) {
                    const amplifier = player.getEffect("speed").amplifier;
                    if(amplifier > 8) return;
                    const baseBPT = config.modules.speedE.bpt;
                    const scaleFactor = amplifier > 2 ? 0.25 - (amplifier - 0.25) * 0.015 : 0.25;

                    maxBPT = baseBPT * fastPow(1 + scaleFactor, amplifier - 1);
                    if(amplifier >= 4) maxBPT = maxBPT - (amplifier * 0.01 * 2) - (0.01 * (4 - amplifier));
                    if(4 - amplifier <= 0) maxBPT -= amplifier * 0.01;
                    if(amplifier == 1) maxBPT == 0.405
                    if(player.hasTag("jump") && amplifier > 3) maxBPT -= 0.02;
                }


                if(bptDiff > 2) {
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
                if(player.hasTag("speedEDebug") && average > 0 && player.hasTag("moving")) player.sendMessage(`${player.name} ${average.toFixed(5)} | ${average * 30} | ${maxBPT} | ${player.getEffect("speed")?.amplifier ?? 0}`);
                if(
                    average > maxBPT && 
                    !player.hasTag("damaged") && 
                    !player.hasTag("op") && 
                    !player.isFlying && 
                    !player.hasTag("trident") && 
                    !player.hasTag("ice") && 
                    !player.hasTag("slime") && 
                    !player.hasTag("speedE_pass") && 
                    !player.hasTag("placing") && 
                    //!player.hasTag("teleport") && 
                    (average * 30).toFixed(2) < config.modules.speedE.maxPredict && 
                    !player.hasTag("elytra")) 
                {
                        flag(player, "Speed", "E", "Movement", "avg_bpt", `${average.toFixed(2)},predict_bps=${(average * 30).toFixed(2)}`, true);
                }
                d.unshift(bptDiff);
                d.pop();
                player.removeTag("speedE_pass");    
            }
            data.set(player.name, d);
        }
        data2.set(player.name, {
            x: fastAbs(player.location.x),
            y: fastAbs(player.location.y),
            z: fastAbs(player.location.z)
        });
    }

}

