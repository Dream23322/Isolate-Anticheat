import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

export function reset(message) {
	const player = message.sender;
    player.sendMessage(`§r§j[§uIsolate§j]§r Reset Config.`);
    world.setDynamicProperty("config", undefined);
}