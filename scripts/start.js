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
	
}
console.warn("[Isolate] >> ConfigID: " + config.configID);
if(config.configID !== "a1c") {
	console.warn("[Isolate] >> Config ID doesnt match latest! Attempting to update config...")
	config.modules.badpacketsK = {
		enabled: true,
		punishment: "ban",
		punishmentLength: "",
		minVlbeforePunishment: 0
	}

	config.customcommands.configid = {
		enabled: true,
		requiredTags: ["op"],
		aliases: ["getid", "id"]
	}

	config.modules.hitboxB = {
		enabled: true,
		description: "Traditional hitbox check (Only for desktop and console players, though console is less strict)",
		max_avg_angle: 50,
		punishment: "none",
		minVlbeforePunishment: 5
	}
	
	console.warn("[Isolate] >> Updated Config Correctly");
}

config.configID = "a1";	

console.warn("[Isolate] >> Loaded Config Correctly");
// Load the ban list
const banlist = world.getDynamicProperty("banList");
if(!banlist) {
	world.setDynamicProperty("banList", "{}");
}
if(banlist) {
	console.warn("[Isolate] >> Loaded Banlist Correctly");
}

const offlineList = world.getDynamicProperty("offlineList");
if(!offlineList) {
	world.setDynamicProperty("offlineList", "{}");
}
if(offlineList) {
	console.warn("[Isolate] >> Loaded OfflineList Correctly");
}

import "./main.js";
console.warn("[Isolate] >> Setup Correctly");