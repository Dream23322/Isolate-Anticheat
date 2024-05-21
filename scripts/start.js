// First file that runs
// Used to setup Isolate
import config from "./data/config.js";
import { world } from "@minecraft/server";


// Code from scythe
const dpConfig = world.getDynamicProperty("config"); // Object
if(dpConfig) {
	const parsedConfig = JSON.parse(dpConfig);
	for(const item of Object.keys(parsedConfig)) {
		config[item] = parsedConfig[item];
	}
	console.warn("[Isolate] >> Loaded Config Correctly");
}


import "./main.js";
console.warn("[Isolate] >> Setup Correctly");