import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

const world = Minecraft.world;

export function module(message, args) {
    const player = message.sender;

    if(args.length < 3) {
        return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide the module name, setting, and new value.");
    }

    const [moduleName, setting, newValue] = args;

    if(!config.modules[moduleName]) {
        return player.sendMessage(`§r§j[§uIsolate§j]§r Module ${moduleName} does not exist.`);
    }

    if(!config.modules[moduleName][setting]) {
        return player.sendMessage(`§r§j[§uIsolate§j]§r Setting ${setting} does not exist in module ${moduleName}.`);
    }

    const boolValue = newValue.toLowerCase() === 'true' ? true : false;
    const numValue = Number(newValue);

    if (boolValue) {
        config.modules[moduleName][setting] = boolValue;
    } else if (!isNaN(numValue)) {
        config.modules[moduleName][setting] = numValue;
    } else {
        config.modules[moduleName][setting] = newValue;
    }

    player.sendMessage(`§r§j[§uIsolate§j]§r You have changed ${setting} of ${moduleName} to ${config.modules[moduleName][setting]}.`);
}
