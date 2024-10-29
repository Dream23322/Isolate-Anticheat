import * as Minecraft from "@minecraft/server";
import config from "../../data/config";

const world = Minecraft.world;

export function configid(message, args) {
	const player = message.sender;
    player.sendMessage(`§r§j[§uIsolate§j]§r Config ID of your Isolate Config is: ${config.configID}`);

    if(args.length) {
        if(config.configID === args[0]) {
            player.sendMessage("§r§j[§uIsolate§j]§r Config ID matches!");
        } else {
            player.sendMessage("§r§j[§uIsolate§j]§r Config ID does not match!");
            player.sendMessage("§r§j[§uIsolate§j]§r Editing Config ID!");

            config.configID = args[0];
        }
    }
}