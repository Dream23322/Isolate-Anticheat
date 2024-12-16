// First file that runs
// Used to setup Isolate
import config from "./data/config.js";
import settings from "./data/settings.js";
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
if(config.configID !== "a4") {
	console.warn("[Isolate] >> Config ID doesnt match latest! Attempting to update config...")
	config.modules.aimH = {
		enabled: true,
		description: "Checks for low standard deviation in Pitch and Yaw",
		needHit: true,
		minAvg: 2.5,
		maxStDev: 2,
		punishment: "kick",
		minVlbeforePunishment: 5,
		AP: 1
	};

	config.modules.aimI = {
		enabled: true,
		description: "Checks for low difference in Pitch",
		needHit: true,
		minAvg: 2.5,
		maxDiff: 0.1,
		punishment: "kick",
		minVlbeforePunishment: 5,
		AP: 1      
	};

	delete config.modules.motionC;
	delete config.modules.invalidsprintA;

	console.warn("[Isolate] >> Updated Config Correctly");
}

config.configID = "a3";	

const dpSettings = world.getDynamicProperty("settings"); // Object
if(dpSettings) {
	const parsedSettings = JSON.parse(dpSettings);
	for(const item of Object.keys(parsedSettings)) {
		settings[item] = parsedSettings[item];
	}
}
console.warn("[Isolate] >> SettingsID: " + settings.id);

if(settings.id !== "a2") {
	console.warn("[Isolate] >> Settings ID doesnt match latest! Attempting to update settings...")
	
	console.warn("[Isolate] >> Updated Settings Correctly");
}

settings.id = "a2";

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
import "./utils/maths/isomath.js";
console.warn("[Isolate] >> Setup Correctly");