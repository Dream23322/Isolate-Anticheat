import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

const world = Minecraft.world;

export function reset(message) {
	const player = message.sender;
    player.sendMessage(`§r§j[§uIsolate§j]§r Reset Config.`);
    world.setDynamicProperty("config", undefined);
}