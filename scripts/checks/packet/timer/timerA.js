import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";
const timerData = new Map();


/*
Check made by _ieroo (@yellowworld777)
Flag Logic made by 4urxra (@Dream23322)
*/
export function timer_a(player, lastPosition, Value){
    if(player.lastPosition && config.modules.timerA.enabled) {
        const velocity = player.getVelocity();
        const calcVelocity = new Minecraft.Vector(player.location.x - lastPosition.x, player.location.y - lastPosition.y, player.location.z - lastPosition.z);
        if(!isMovingWithVelocity(velocity)) return;
        const ServerSpeed = Math.hypot(Math.hypot(calcVelocity.x, calcVelocity.z), calcVelocity.y);
        const ClientSpeed = Math.hypot(Math.hypot(velocity.x, velocity.z), velocity.y);
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
            if(player.hasTag("timer-debug")) {
                player.runCommandAsync(`title @s actionbar timer:${timerValue}: V:${Value}`);
            }    
            if(timerData.has(player)) {
                let timer_lev = config.modules.timerA.timer_level;
                let timer_lev_low = config.modules.timerA.timer_level_low;
                if(config.modules.timerA.strict && player.hasTag("strict")) {
                    timer_lev--;
                    timer_lev_low++;
                }
                if(timerData.get(player) > timer_lev && (timerValue) > timer_lev || timerData.get(player) < timer_lev_low && (timerValue) < timer_lev_low) {
                    const playerVelocity = player.getVelocity();
                    if(Math.abs(player.lastPosition.y - player.location.y) > 5) {
                        timerData.set(player, 20);
                        player.addTag("timer_bypass");
                    }
                    if(!player.hasTag("timer_bypass") && !player.hasTag("ender_pearl")) {
                        flag(player, "Timer", "A", "Packet", "timer", timerData.get(player), false);
                    }
                }
            }
            if(!player.hasTag("timer_bypass")) {
                timerData.set(player, timerValue);
            }
            player.timerHold.splice(0);
        }

    }
    player.lastPosition = player.location;
}

function isMovingWithVelocity(velocity){
	return Math.abs(Math.hypot(velocity.x, velocity.z)) > 0.01;
}
