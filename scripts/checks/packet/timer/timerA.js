import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
const timerData = new Map();


/*
Check made by _ieroo (@yellowworld777)
Flag Logic made by 4urxra (@Dream23322)
*/
export function timer_a(player, lastPosition, Value){
    if(player.lastPosition && config.modules.timerA.enabled && (!config.modules.timerA.safe.placing || !player.hasTag("placing"))) {
        const velocity = player.getVelocity();
        const calcVelocity = new Minecraft.Vector(player.location.x - lastPosition.x, player.location.y - lastPosition.y, player.location.z - lastPosition.z);
        if(!isMovingWithVelocity(velocity)) return;
        const ServerSpeed = Math.abs(Math.hypot(Math.hypot(calcVelocity.x, calcVelocity.z), calcVelocity.y));
        const ClientSpeed = Math.abs(Math.hypot(Math.hypot(velocity.x, velocity.z), velocity.y));
        const duped = ServerSpeed / ClientSpeed;
        if(player.timerHold == null) player.timerHold = [];
        player.timerHold.push(duped * 20 / Value);
	    if(duped == 0) return;
        if(player.timerHold.length >= 20){
            let timer = 0;
            for(const currentTH of player.timerHold){
                timer += currentTH;
            }
            let timerValue = timer / player.timerHold.length / Value;
            if(player.timerHold.length >= 24){
		        timerValue += 2;
            }
            if(player.hasTag("timer-debug")) player.runCommandAsync(`title @s actionbar timer:${timerValue}: V:${Value}`);
            if(timerData.has(player)) {
                const flag_data = shouldFlag(player, timerData, timerValue);
                if(flag_data.flag) {
                    const playerVelocity = player.getVelocity();
                    if(Math.abs(player.lastPosition.y - player.location.y) > 5) {
                        timerData.set(player, 20);
                        player.addTag("timer_bypass");
                    }
                    if(!player.hasTag("timer_bypass") && !player.hasTag("ender_pearl")) {
                        flag(player, "Timer", "A", "Packet", "timer", flag_data.val, false);
                    }
                }
            }
            if(!player.hasTag("timer_bypass")) {
                timerData.set(player, timerValue);
            }
            update_data(player, timerData, timerValue);
            player.timerHold.splice(0);
        }
    }
    player.lastPosition = player.location;
}
function isMovingWithVelocity(velocity){
	return Math.abs(Math.hypot(velocity.x, velocity.z)) > 0.01;
}
function shouldFlag(player, timerData, timer_value) {
    // Chinese code :skull:
    const value_one = timer_value || 20;
    const value_two = timerData.get(player)?.a || 20;
    const value_three = timerData.get(player)?.b || 20;
    const value_four = timerData.get(player)?.c || 20;
    const value_five = timerData.get(player)?.d || 20;
    let timer_lev = config.modules.timerA.timer_level;
    let timer_lev_low = config.modules.timerA.timer_level_low;
    if(config.modules.timerA.strict && player.hasTag("strict")) {
        timer_lev--;
        timer_lev_low++;
    }
    // Average Mode
    if(config.modules.timerA.mode == "average") {
        const average = (value_one + value_two + value_three + value_four + value_five) / 5;
        if(average > config.modules.timerA.timer_level || average < config.modules.timerA.timer_level_low) {
            return {flag: true, val: average};
        }
    } else if(config.modules.timerA.module == "all") {
        // Timer above
        const list = [value_one, value_two, value_three, value_four, value_five];
        if(Math.max(list) > config.modules.timerA.timer_level && Math.min(list) > config.modules.timerA.timer_level || Math.max(list) < config.modules.timerA.timer_level_low) {
            return {flag: true, val: Math.max(list)};
        }
    } else {
        return {flag: false};
    }
}

function update_data(player, timerData, timer_value) {
    timerData.set(player, {
        a: timer_value || 20,
        b: timerData.get(player)?.a || 20,
        c: timerData.get(player)?.b || 20,
        d: timerData.get(player)?.c || 20
    });
}
