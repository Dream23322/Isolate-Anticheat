import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

const world = Minecraft.world;
const commandName = "module";
export function module(message, args) {
	const player = message.sender;
	const category = commandName === "module" ? "modules" : "misc_modules";
    const module = args[0];
	const name = args[1];
	const value = args.slice(2).join(" ");

	if(!module) return player.sendMessage(`§r§j[§uIsolate§j]§r Module list: ${Object.keys(config[category]).join(", ")}`);

	const moduleData = config[category][module];
	if(!moduleData) return player.sendMessage(`§r§j[§uIsolate§j]§r No such module as ${module} exists. Please select a module from this list: ${Object.keys(config[category]).join(", ")}`);

	if(!name) return player.sendMessage(`§r§j[§uIsolate§j]§r ${module} data:\n${JSON.stringify(moduleData, null, 2)}`);

	if(!moduleData[name]) return player.sendMessage(`§r§j[§uIsolate§j]§r ${module} does not have a setting called ${name}. Please select a setting from this list: ${Object.keys(moduleData).join(", ")}`);
    
	let newValue;
	switch(typeof moduleData[name]) {
		case "boolean": 
			newValue = value === "true" ? true : false;
			break;
			
		case "number":
			newValue = Number(value);
			break;

		case "string":
			newValue = value;
			break;
			
		// "Object" type is kind of a wildcard, it can refer to normal objects, arrays,, regexs, promises, etc
		case "object": {
			// Normal objects and Arrays can both be parsed with JSON.parse
			if(moduleData[name] instanceof RegExp) {
				newValue = RegExp(value);
			} else {
				newValue = JSON.parse(value);
			}
			break;
		}
	}

	moduleData[name] = newValue;

	player.sendMessage(`§r§j[§uIsolate§j]§r ${module}'s data has been updated. New Data: ${JSON.stringify(moduleData, null, 2)}`);
}
