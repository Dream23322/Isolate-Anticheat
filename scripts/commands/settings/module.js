import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

const world = Minecraft.world;
const commandName = "module";
export function module(message, args) {
	const player = message.sender;
	const [ module, name ] = args;
	const value = args.slice(2).join(" ");

	const category = commandName === "module" ? "modules" : "misc_modules";

	if(!module) return player.sendMessage(`§r§j[§uIsolate§j]§r Module list: ${Object.keys(config[category]).join(", ")}`);

	const moduleData = config[category][module];
	if(!moduleData) return player.sendMessage(`§r§j[§uIsolate§j]§r No such module as ${module} exists. Please select a module from this list: ${Object.keys(config[category]).join(", ")}`);

	if(!name) return player.sendMessage(`§r§j[§uIsolate§j]§r ${module} data:\n${JSON.stringify(moduleData, null, 2)}`);

	if(moduleData[name] === undefined) return player.sendMessage(`§r§j[§uIsolate§j]§r ${module} does not have a setting called ${name}. Please select a setting from this list: ${Object.keys(moduleData).join(", ")}`);

	if(value === "") return player.sendMessage(`§r§j[§uIsolate§j]§r You need enter a value for this setting.`);

	let newValue;
	switch(moduleData[name]?.constructor.name) {
		case "Boolean":
			newValue = value === "true" ? true : false;
			break;

		case "Number":
			newValue = Number(value);
			break;

		case "String":
			newValue = value;
			break;

		case "Array":
			newValue = JSON.parse(value.replace(/'/g, '"'));
			break;

		case "RegExp":
			newValue = RegExp(value);
			break;
	}

	moduleData[name] = newValue;

	// Save config
	world.setDynamicProperty("config", JSON.stringify(config));

	player.sendMessage(`§r§j[§uIsolate§j]§r ${module}'s data has been updated. New Data: ${JSON.stringify(moduleData, null, 2)}`);
}
