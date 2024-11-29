// @ts-check

// @ts-ignore
import * as Minecraft from "@minecraft/server";
import { tag_system, aroundAir, add_effect} from "./utils/gameUtil.js";
import { getBlocksBetween, angleCalc, getDistanceXZ } from "./utils/maths/mathUtil.js";
import { getClosestPlayer, getScore, setScore } from "./util.js";
import { banMessage } from "./utils/anticheat/punishment/ban.js";
import { flag } from "./utils/anticheat/punishment/flag.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui } from "./features/ui.js";
import { joinData } from "./utils/anticheat/acUtil.js";

// Import Packet Checks
import { badpackets_f } from "./checks/packet/badpackets/badpacketsF.js";
import { badpackets_g } from "./checks/packet/badpackets/badpacketsG.js";
import { badpackets_h } from "./checks/packet/badpackets/badpacketsH.js";
import { badpackets_i } from "./checks/packet/badpackets/badpacketsI.js";
import { exploit_b } from "./checks/packet/exploit/exploitB.js";
import { badpackets_c } from "./checks/packet/badpackets/badpacketsC.js";
import { badpackets_e } from "./checks/packet/badpackets/badpacketsE.js";

// Import movement checks
import { speed_c } from "./checks/movement/speed/speedC.js";
import { speed_a } from "./checks/movement/speed/speedA.js";
import { speed_b } from "./checks/movement/speed/speedB.js";
import { motion_a } from "./checks/movement/motion/motionA.js";
import { motion_b } from "./checks/movement/motion/motionB.js";
import { motion_c } from "./checks/movement/motion/motionC.js";
import { fly_c } from "./checks/movement/fly/flyC.js";
import { noslow_a } from "./checks/movement/noslow/noslowA.js";
import { noslow_b } from "./checks/movement/noslow/noslowB.js";
import { fly_a } from "./checks/movement/fly/flyA.js";
import { exploit_a } from "./checks/packet/exploit/exploitA.js";
import { timer_a } from './checks/packet/timer/timerA.js';
import { fly_b } from "./checks/movement/fly/flyB.js";
import { speed_d } from "./checks/movement/speed/speedD.js";
import { strafe_a } from "./checks/movement/strafe/strafeA.js";
import { fly_d } from "./checks/movement/fly/flyD.js";

// Import World Checks
import { scaffold_f } from "./checks/world/scaffold/scaffoldF.js";
import { nuker_c } from "./checks/world/nuker/nukerC.js";
import { nuker_b } from "./checks/world/nuker/nukerB.js";
import { reach_c } from "./checks/world/reach/reachC.js";
import { scaffold_b } from "./checks/world/scaffold/scaffoldB.js";
import { scaffold_c } from "./checks/world/scaffold/scaffoldC.js";
import { tower_a } from "./checks/world/scaffold/towerA.js";
import { scaffold_a } from "./checks/world/scaffold/scaffoldA.js";
import { scaffold_e } from "./checks/world/scaffold/scaffoldE.js";
import { nuker_d } from "./checks/world/nuker/nukerD.js";

// Import Combat checks
import { killaura_c } from "./checks/combat/killaura/killauraC.js";
import { killaura_f } from "./checks/combat/killaura/killauraF.js";
import { killaura_d } from "./checks/combat/killaura/killauraD.js";
import { hitbox_a } from "./checks/combat/hitbox/hitboxA.js";
import { reach_a } from "./checks/combat/reach/reachA.js";
import { killaura_e } from "./checks/combat/killaura/killauraE.js";
import { killaura_b } from "./checks/combat/killaura/killauraB.js";
import { killaura_a } from "./checks/combat/killaura/killauraA.js";
import { aim_a } from "./checks/combat/aim/aimA.js";
import { autoclicker_a } from "./checks/combat/autoclicker/autoclickerA.js";
import { autoclicker_b } from "./checks/combat/autoclicker/autoclickerB.js";
import { aim_b } from "./checks/combat/aim/aimB.js";
import { aim_c } from "./checks/combat/aim/aimC.js";
import { autoclicker_c } from "./checks/combat/autoclicker/autoclickerC.js";
import { autoclicker_d } from "./checks/combat/autoclicker/autoclickerD.js";
import { speed_e } from "./checks/movement/speed/speedE.js";
import { teleportCheck } from "./utils/tag/teleport.js";
import { reach_b } from "./checks/combat/reach/reachB.js";
import { autoclicker_e } from "./checks/combat/autoclicker/autoclickerE.js";
import { aim_d } from "./checks/combat/aim/aimD.js";
import { scaffold_d } from "./checks/world/scaffold/scaffoldD.js";
import { tower_b } from "./checks/world/scaffold/towerB.js";
import { aim_e } from "./checks/combat/aim/aimE.js";
import { aim_f } from "./checks/combat/aim/aimF.js";
import { autoConfigGUI } from "./features/autoconfig.js";
import { fastAbs, fastFloor, fastPow, fastSqrt } from "./utils/maths/fastMath.js";
import { aim_g } from "./checks/combat/aim/aimG.js";
import { aim_h } from "./checks/combat/aim/aimH.js";
import { run_aim_data } from "./checks/combat/aim/aimData.js";
import { total_a } from "./checks/combat/total/totalA.js";
import { total_b } from "./checks/movement/total/totalB.js";
import { total_c } from "./checks/packet/total/totalC.js";
import { total_d } from "./checks/world/total/totalD.js";
import { badpackets_k } from "./checks/packet/badpackets/badpacketsK.js";
import { badpackets_j } from "./checks/packet/badpackets/badpacketsJ.js";
import { hitbox_b } from "./checks/combat/hitbox/hitboxB.js";
import { aim_i } from "./checks/combat/aim/aimI.js";
import { predictionEngine } from "./checks/movement/prediction/predictionEngine.js";
import settings from "./data/settings.js";

const world = Minecraft.world;
const system = Minecraft.system;

let lagValue = 1;

// Maps for logging data that we use in checks
const lastMessage = new Map();
const lastXZv = new Map();
const speedCLog = new Map();
const dmg_data = new Map();
const tp_data = new Map();

world.beforeEvents.chatSend.subscribe((msg) => {
	const message = msg.message.toLowerCase();
	const player = msg.sender;

	if(config.debug && message === "ping") console.warn(`${new Date().toISOString()} | Pong!`);

	if(message.includes("the best minecraft bedrock utility mod") || message.includes("disepi/ambrosial")) msg.cancel = true;
	
	if(lastMessage && lastMessage.get(player) === message) {
		msg.cancel = true;
		player.sendMessage("§cPlease do not repeat yourself");
	}

	lastMessage.set(player, message);

	if(player.hasTag("isMuted")) {
		msg.cancel = true;
		player.sendMessage("§r§j[§uIsolate§j]§r §1§lNOPE! §r§cYou have been muted.");
	}

	commandHandler(msg);

	if(message.charAt(0) == "!" && msg.cancel == false) {
        msg.cancel = true;
		player.sendMessage("§r§j[§uIsolate§j]§r Unknown Command! Use !help for a list of commands.");
    }

	// add's user custom tags to their messages if it exists or we fall back
	// also filter for non ASCII characters and remove them in messages
	if(!msg.cancel) {
		if(player.name !== player.nameTag && !config.modules.filterUnicodeChat) {
			world.sendMessage(`${player.nameTag}§7:§r ${msg.message}`);
			msg.cancel = true;
		} else if(player.name === player.nameTag && config.modules.filterUnicodeChat) {
			world.sendMessage(`<${player.nameTag}> ${msg.message.replace(/[^\x00-\xFF]/g, "")}`);
			msg.cancel = true;
		}
	}
});

world.afterEvents.chatSend.subscribe((msg) => {
	const player = msg.sender;

	msg.sendToTargets = true;

	// Spammer/A = checks if someone sends a message while moving and on ground
	if(config.modules.spammerA.enabled && player.hasTag('moving') && player.hasTag('ground') && !player.hasTag('jump'))
		return flag(player, "Spammer", "A", "Movement", undefined, undefined, true, msg);

	// Spammer/B = checks if someone sends a message while swinging their hand
	if(config.modules.spammerB.enabled && player.hasTag('left') && !player.getEffect(Minecraft.MinecraftEffectTypes.miningFatigue))
		return flag(player, "Spammer", "B", "Combat", undefined, undefined, true, msg);
	// Spammer/C = checks if someone sends a message while using an item
	if(config.modules.spammerC.enabled && player.hasTag('right'))
		return flag(player, "Spammer", "C", "Misc", undefined, undefined, true, msg);
	// Spammer/D = checks if someone sends a message while having a GUI open
	if(config.modules.spammerD.enabled && player.hasTag('hasGUIopen'))
		return flag(player, "Spammer", "D", "Misc", undefined, undefined, true, msg);


	// commandHandler(player, msg);
});

world.afterEvents.entityHurt.subscribe((data) => {
	const player = data.hurtEntity;

	if(player.typeId !== "minecraft:player") return;

	player.addTag("damaged");

	if(data.damageSource.cause === "fall") player.addTag("fall_damage");

	dmg_data.set(player.name, Date.now());

	if(config.debug) console.warn(`${new Date().toISOString()} |${player.name} was damaged!`);
});

Minecraft.system.runInterval(() => {
  if (config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;

	// Run the code for each player
	for (const player of world.getPlayers()) {

		// Define Variables
		const rotation = player.getRotation();
		const playerVelocity = player.getVelocity();
		const selectedSlot = player.selectedSlotIndex;

		if(player.isGlobalBanned && config.modules.globalBan.enabled) {
			player.addTag("by:Isolate Anticheat");
			player.addTag("reason:You are in a hacker database!");
			player.addTag("isBanned");
		}

		// sexy looking ban message
		if(player.hasTag("isBanned")) banMessage(player);

		if(player.blocksBroken >= 1 && config.modules.nukerA.enabled) player.blocksBroken = 0;
		if(player.entitiesHit?.length >= 1 && config.modules.killauraC.enabled) player.entitiesHit = [];
		if(Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay && player.lastSelectedSlot !== selectedSlot) {
			player.flagAutotoolA = true;
			player.autotoolSwitchDelay = Date.now() - player.startBreakTime;
		}

		// anti-namespoof
		// these values are set in the playerJoin event
		if(player.flagNamespoofA) {
			flag(player, "Namespoof", "A", "Exploit", "nameLength", player.name.length);
			player.flagNamespoofA = false;
		}
		if(player.flagNamespoofB) {
			flag(player, "Namespoof", "B", "Exploit");
			player.flagNamespoofB = false;
		}

		// player position shit
		if(player.hasTag("moving")) {
			player.runCommandAsync(`scoreboard players set @s xPos ${fastFloor(player.location.x)}`);
			player.runCommandAsync(`scoreboard players set @s yPos ${fastFloor(player.location.y)}`);
			player.runCommandAsync(`scoreboard players set @s zPos ${fastFloor(player.location.z)}`);
		}
		
		if(settings.general.autoReset && getScore(player, "tick_counter2", 0) > 300) {
			if(!player.hasTag("reported") && player.hasTag("strict")) player.removeTag("strict");
			player.runCommandAsync("function tools/resetwarns");
			setScore(player, "tick_counter2", 0);
		}

		const blockBelow = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z}) ?? {typeId: "minecraft:air"};

		const blockTags = ["ice", "slime", "end_portal", "stairs"];
		blockTags.forEach(tag => {
			if (blockBelow.typeId.includes(tag)) {
				player.addTag(tag);
			}
		});

		if (player.hasTag("trident")) setScore(player, "right", 0);

		tag_system(player);
		if(player.hasTag("runUI")) {
			player.removeTag("runUI")
			mainGui(player);
		}
		if(player.hasTag("autoconfigui")) {
			player.removeTag("autoconfigui")
			autoConfigGUI(player);
		}
		// AirTime 
		const flyTime = getScore(player, "airTime", 0);
		if(!player.isOnGround && !player.hasTag("ground") && aroundAir(player)) {
			setScore(player, "airTime", flyTime + 1);
		} else {
			setScore(player, "airTime", 0);
		}

  
		const tickValue = getScore(player, "tickValue", 0);                            
		if(player.hasTag("slime")) setScore(player, "tick_counter2", 0);

		if(rotation.x !== 0 && rotation.y !== 0 && player.isOnGround) {
			const pos1 = {x: player.location.x, y: player.location.y, z: player.location.z};
			const pos2 = {x: player.location.x, y: player.location.y + 1, z: player.location.z};
			const isInAir = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:air");
			if(isInAir) {
				player.lastGoodPosition = player.location;	
			}
		}

		if(config.generalModules.fly === true && !player.hasTag("nofly") && !player.hasTag("op")) {
			fly_a(player);
			fly_b(player);
			fly_c(player);
			fly_d(player);
		}
		if(config.generalModules.speed && !player.hasTag("nospeed")) {
			speed_a(player);
			speed_b(player);
			speed_c(player, tickValue, speedCLog);
			speed_d(player);
			speed_e(player);
		}
		if(config.generalModules.motion && !player.hasTag("nomotion") && !player.hasTag("end_portal")) {
			motion_a(player);
			motion_b(player);
			motion_c(player, lastXZv);
		}
		if(config.generalModules.packet && !player.hasTag("nobadpackets")) {
			exploit_a(player);
			exploit_b(player);
			badpackets_f(player);
			badpackets_g(player);
			badpackets_h(player);
			badpackets_i(player);
			timer_a(player, player.lastPosition, lagValue);
		}

		// General movement
		if(config.generalModules.movement) {
			strafe_a(player);
			noslow_a(player);
			noslow_b(player);
			predictionEngine(player);
		}
		if(player.hasTag("aimtempdebug")) {
			// Send message with rotation data
			player.sendMessage(`Rotation: ${rotation.x}, ${rotation.y}`);
		}


		if(config.generalModules.aim) {
			run_aim_data(player);
			aim_a(player);
			aim_b(player);
			aim_c(player);
			aim_e(player);
			aim_f(player);
			aim_g(player);
			aim_h(player);
			aim_i(player);
		}

		// Scaffold/F = Checks for placing too many blocks in 20 ticks... 
		if (config.modules.scaffoldF.enabled && !player.hasTag("noscaffold")) {
			const blocksPlaced = getScore(player, "scaffoldAmount", 0);
			const blocksPerSecond = config.modules.scaffoldF.blocksPerSecond + (player.getEffect("speed")?.amplifier ?? 0);

			if (tickValue > 20 && playerVelocity.y < 0.3) {
				setScore(player, "scaffoldAmount", 0);
				setScore(player, "tickValue", 0);
			} else {
				setScore(player, "tickValue", tickValue + 1);
			}

			if (blocksPlaced > blocksPerSecond && !player.getEffect("speed")) {
				flag(player, "Scaffold", "F", "Limit", "amount", blocksPlaced, false);
			}
		}
		if(!player.hasTag("attacking") && player.hasTag("leftv2") && !player.hasTag("usingItem") && !player.hasTag("useItem") && !player.hasTag("interactBlock")) {
			killaura_f(player, 0);
			
			if(settings.general.advancedCPS) player.cps++;
		}


		// Remove tags for checks :D
		["attacking", "usingItem", "breaking", "leftv2"].forEach((tag) => player.removeTag(tag));

		const tickCounter = getScore(player, "tick_counter", 0);
		const packets = getScore(player, "packets", 0);
		const tagReset = getScore(player, "tag_reset", 0);
		const aimcReset = getScore(player, "aimc_reset", 0);
		if(tickValue > 19) {
			total_a(player);
			total_b(player);
			total_c(player);
			total_d(player);
			setScore(player, "tick_counter", tickCounter + 1);
			setScore(player, "tick_counter2", getScore(player, "tick_counter2", 0) + 1);
			setScore(player, "tag_reset", tagReset + 1);
			setScore(player, "aimc_reset", aimcReset + 1);
			setScore(player, "motion_c_data", 0);

			badpackets_e(player);
			player.removeTag("speedE_pass");

			if(player.hasTag("packetlogger")) player.runCommandAsync(`title @s actionbar packets:${packets}`);
			player.removeTag("snow");

			setScore(player, "packets", 0);


		}

		if(getScore(player, "tag_reset", 0) > 5) {
			const removalTags = [
				"slime", "placing", "ice", "fall_damage", 
				"end_portal", "stairs", "timer_bypass", "ender_pearl", 
				"useItem", "interactBlock", "speedE_pass", "fighting",
				"attacking", "teleport"
			];
			removalTags.forEach(tag => player.removeTag(tag));
			setScore(player, "tag_reset", 0);
		}

		if(teleportCheck(player)) {
			player.addTag("teleport")
			tp_data.set(player.name, Date.now())
		}
		if(player.hasTag("damaged") && Date.now() - dmg_data.get(player.name) >= 4000) {
			player.removeTag("damaged");
		}

		if(player.hasTag("teleport") && Date.now() - tp_data.get(player.name) >= 4000) {
			player.removeTag("teleport");
		}
		if(player.hasTag("isolate_em_reset_config")) {
			player.removeTag("isolate_em_reset_config");
			world.setDynamicProperty("config", undefined);
		}


		autoclicker_a(player);
		autoclicker_b(player);
		autoclicker_c(player);
		autoclicker_d(player);
		autoclicker_e(player);

		if(player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
			player.firstAttack = Date.now();
			player.cps = 0;
		}

	}
});

world.afterEvents.playerPlaceBlock.subscribe((blockPlace) => {
	const { block, player} = blockPlace;
	const rotation = player.getRotation()
	const playerVelocity = player.getVelocity();
	const playerSpeed = Number(fastSqrt(fastAbs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
	if(config.debug) console.warn(`${player.nameTag} has placed ${block.typeId}. Speed: ${playerSpeed} Distance: ${fastSqrt(fastPow(block.location.x - player.location.x, 2) + fastPow(block.location.z - player.location.z, 2))} Player X Rotation: ${rotation.x} Player Y Rotation: ${rotation.y}`);
	
	
	let undoPlace = false; 

	// ==================================
	//               Scaffold Checks
	// ==================================

	if(config.generalModules.scaffold && !player.hasTag("noscaffold")) {
		scaffold_a(player, block);
		scaffold_b(player, block);
		scaffold_c(player, block);
		scaffold_d(player, block);
		scaffold_e(player);
		scaffold_f(player, block);
		tower_a(player, block);
		tower_b(player, block);
	}
	if(player.hasTag("tempblockdebug")) player.sendMessage(`§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> Rotation Data: §b${rotation.x} §b${rotation.y}`);
	reach_c(player, block);
	player.addTag("placing");

	if(undoPlace) {
		try {
			block.setType(Minecraft.MinecraftBlockTypes.air);
			console.warn(`${player.nameTag} had their placed block reverted!`);
		} catch (error) {
			console.warn(`${player.nameTag} had their placed block reverted!`);
			player.runCommandAsync(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air`)
		}
	}
});
world.beforeEvents.playerBreakBlock.subscribe((blockBreak) => {
	const player = blockBreak.player;
	const block = blockBreak.block;
	
	nuker_c(player, block, blockBreak, Minecraft);

});
world.afterEvents.playerBreakBlock.subscribe((blockBreak) => {
	const player = blockBreak.player;
	const dimension = blockBreak.dimension;
	const block = blockBreak.block;
	const brokenBlockId = blockBreak.brokenBlockPermutation.type.id;

	let revertBlock = false;
	if(!player.hasTag("breaking")) {
		player.addTag("breaking");
	}

	// Hive regen
	if(settings.general.hiveRegen) {
		if(brokenBlockId === "minecraft:redstone_ore" || brokenBlockId === "minecraft:lit_redstone_ore") {
			add_effect(player, "absorption", 10, 0);
		}
	}

	if(config.debug) console.warn(`${player.nameTag} has broken the block ${blockBreak.brokenBlockPermutation.type.id}`);
	




	if(config.modules.nukerA.enabled) {
		player.blocksBroken++;

		if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
			revertBlock = true;
			flag(player, "Nuker", "A", "Misc", "blocksBroken", player.blocksBroken, true);	
		}
	}


	nuker_b(player, block, brokenBlockId);

	nuker_c(player, block, brokenBlockId);

	nuker_d(player, block, brokenBlockId, blockBreak.brokenBlockPermutation);
	
	if(brokenBlockId === "minecraft:snow" || brokenBlockId === "minecraft:snow_layer") {
		player.addTag("snow");
	}

	// Autotool/A = checks for player slot mismatch
	if(config.modules.autotoolA.enabled && player.flagAutotoolA && !player.hasTag("gmc")) {
		revertBlock = true;
		flag(player, "AutoTool", "A", "Misc", "selectedSlot", `${player.selectedSlotIndex},lastSelectedSlot=${player.lastSelectedSlot},switchDelay=${player.autotoolSwitchDelay}`);
	}

	/*
		InstaBreak/A = checks if a player in survival breaks an unbreakable block
		While the InstaBreak method used in Horion and Zephyr are patched, there are still some bypasses
		that can be used
	*/
	if(config.modules.instabreakA.enabled && config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {

		if(!player.hasTag("gmc")) {
			revertBlock = true;
			flag(player, "InstaBreak", "A", "Exploit", "block", blockBreak.brokenBlockPermutation.type.id, true);
		}
	}

	if(revertBlock) {
		// killing all the items it drops
		const droppedItems = dimension.getEntities({
			location:{x: block.location.x, y: block.location.y, z: block.location.z},
			minDistance: 0,
			maxDistance: 2,
			type: "item"
		});

		for(const item of droppedItems) item.kill();

		block.setPermutation(blockBreak.brokenBlockPermutation);
	}
});
world.afterEvents.playerLeave.subscribe((playerLeave) => {
    const player = playerLeave.playerName;
    const message = `§u${player} §hhas §pleft§j the server`;
    // @ts-ignore
    data.recentLogs.push(message);
});
world.afterEvents.playerSpawn.subscribe((playerJoin) => {
	const { initialSpawn, player } = playerJoin;
	if(!initialSpawn) return;

	// declare all needed variables in player
	if(config.modules.nukerA.enabled) player.blocksBroken = 0;
	if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
	if(config.modules.autoclickerA.enabled) player.cps = 0;
	if(config.customcommands.report.enabled) player.reports = [];
	if(config.modules.killauraC.enabled) player.entitiesHit = [];
	player.lastGoodPosition = player.location;
	setScore(player, "tick_counter2", 0);
	exploit_a(player);

	// fix a disabler method
	player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "").trim();


	// remove tags
	const tagsToRemove = ["attack", "hasGUIopen", "right", "left", "ground", "gliding", "sprinting", "moving", "sleeping", "attacking", "fighting", "teleport", "useItem", "leftv2", "fall_damage"];
	tagsToRemove.forEach(tag => player.removeTag(tag));

	const message = `§u${player.name} §hhas §pjoined§h the server`;
    
	// @ts-ignore
	data.recentLogs.push(message)
	// load custom nametag
	const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;
	joinData(player);

	player.getTags().forEach(t => {
		// load custom nametag
		if(t.includes("tag:")) {
			t = t.replace(/"|\\/g, "");
			player.nameTag = `${borderColor}[§r${mainColor}${t.slice(4)}${borderColor}]§r ${playerNameColor}${player.name}`;
		}


		
	});
	// Namespoof/A = username length check.
	if (config.modules.namespoofA.enabled) {
		const isPlayerNameWithSuffix = player.name.endsWith(')');
		const isPlayerNameTooLong = player.name.length > config.modules.namespoofA.maxNameLength + 3 || player.name.length < config.modules.namespoofA.minNameLength;
		const isPlayerNameTooShort = player.name.length < config.modules.namespoofA.minNameLength || player.name.length > config.modules.namespoofA.maxNameLength;

		player.flagNamespoofA = isPlayerNameWithSuffix && isPlayerNameTooLong || !isPlayerNameWithSuffix && isPlayerNameTooShort;

		if (player.flagNamespoofA) {
			const extraLength = player.name.length - config.modules.namespoofA.maxNameLength;
			player.nameTag = player.name.slice(0, -extraLength) + '...';
		}
	}

	// Namespoof/B = regex check
	if(config.modules.namespoofB.enabled && config.modules.namespoofB.regex.test(player.name))
		player.flagNamespoofB = true;
	badpackets_j(player);
	player.addTag(player.clientSystemInfo.platformType);
	badpackets_k(player);
	// check if the player is in the global ban list
	if(banList.includes(player.name.toLowerCase())) player.isGlobalBanned = true;
});

world.afterEvents.entitySpawn.subscribe((entityCreate) => {
	const entity = entityCreate.entity;

	if(config.modules.itemSpawnRateLimit.enabled) {
		data.entitiesSpawnedInLastTick++;

		if(data.entitiesSpawnedInLastTick > config.modules.itemSpawnRateLimit.entitiesBeforeRateLimit) {
			if(config.debug) console.warn(`Killed "${entity.typeId}" due to entity spawn ratelimit reached.`);
			entity.kill();
		}
	}
	if (config.modules.commandblockexploitG.enabled) {
		const entityTypeId = entity.typeId.toLowerCase();
		const entitiesToCheck = config.modules.commandblockexploitG.entities;
		const npcCheck = config.modules.commandblockexploitG.npc && entityTypeId === "minecraft:npc";
		const blockSummonCheck = config.modules.commandblockexploitG.blockSummonCheck.includes(entityTypeId);

		if (entitiesToCheck.includes(entityTypeId) || npcCheck) {
			const closestPlayer = getClosestPlayer(entity);
			flag(closestPlayer, "CommandBlockExploit", "G", "Exploit", "entity", entityTypeId);
			entity.kill();
		}

		if (npcCheck) {
			entity.runCommandAsync("scoreboard players operation @s npc = scythe:config npc");
			entity.runCommandAsync("testfor @s[scores={npc=1..}]").then((commandResult) => {
				if (commandResult.successCount < 1) return;
				const closestPlayer = getClosestPlayer(entity);
				flag(closestPlayer, "CommandBlockExploit", "G", "Exploit", "entity", entityTypeId);
				entity.kill();
			});
		}

		if (blockSummonCheck) {
			const pos1 = { x: entity.location.x + 2, y: entity.location.y + 2, z: entity.location.z + 2 };
			const pos2 = { x: entity.location.x - 2, y: entity.location.y - 2, z: entity.location.z - 2 };
			const dimension = entity.dimension;

			for (const block of pos1.blocksBetween(pos2)) {
				const blockType = dimension.getBlock(block);
				const blockTypeId = blockType.typeId.toLowerCase();

				if (!config.modules.commandblockexploitG.blockSummonCheck.includes(blockTypeId)) continue;

				blockType.setType(Minecraft.MinecraftBlockTypes.air);
				entity.kill();
				break;
			}
		}
	}

	
	const checkEntityCluster = (entityType, maxCount) => {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiArmorStandCluster.radius,
			type: entityType
		})];

		if (entities.length > maxCount) {
			const offender = getClosestPlayer(entity);
			const message = `§r§n[§qTea-Protect§n]§r Potential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${maxCount} ${entityType}s in this area! Possible Offender: ${offender}`;
			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"${message}"}]}`);
			flag(offender, "Exploit", "A", "Lag", "machine", entityType, false);
			for (const entityLoop of entities) {
				entityLoop.kill();
			}
		}
	}

	if (config.misc_modules.lag_machine.antiArmorStandCluster.enabled && entity.typeId === "minecraft:armor_stand") {
		checkEntityCluster("armor_stand", config.misc_modules.lag_machine.antiArmorStandCluster.max_armor_stand_count);
	}

	if (config.misc_modules.lag_machine.antiMinecartCluster.enabled) {
		const minecartTypes = ["minecart", "hopper_minecart", "tnt_minecart", "chest_minecart"];
		for (const type of minecartTypes) {
			if (entity.typeId === `minecraft:${type}`) {
				checkEntityCluster(type, config.misc_modules.lag_machine.antiMinecartCluster.max_count);
				break;
			}
		}
	}

});

world.afterEvents.entityHitEntity.subscribe(({ hitEntity: entity, damagingEntity: player}) => {
	// Hitting an end crystal causes an error when trying to get the entity location. isValid() fixes that
	if(player.typeId !== "minecraft:player" || !entity.isValid()) return;

    const rotation = player.getRotation();
	if(!player.hasTag("attacking")) {
		player.addTag("attacking")
	}
	if(!player.hasTag("fighting")) {
		player.addTag("fighting");
	}

	aim_d(player);

	if(config.generalModules.killaura && !player.hasTag("noaura") && !entity.typeId.includes("boat")) {
		killaura_a(player, entity);
		killaura_b(player, system, entity);
		killaura_c(player, entity, player.entitiesHit);
		killaura_d(player);
		killaura_e(player);
		killaura_f(player, 1);
	}

	hitbox_a(player, entity);
	hitbox_b(player, entity);
	reach_a(player, entity);
	reach_b(player, entity);
	
	badpackets_c(player, entity);

	if(config.modules.autoclickerA.enabled ||config.modules.autoclickerB.enabled || config.modules.autoclickerC.enabled || config.modules.autoclickerD.enabled) {
		player.cps++;
	}
	if(player.hasTag("tempcombatdebug")) player.sendMessage(`§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> Rotation Data: §b${rotation.x} §b${rotation.y} | ${player.hasTag("sprint")} | ${player.isSprinting}`);
	if(entity.typeId == "minecraft:player") {
		player.runCommandAsync(`tellraw @a[tag=seeREACH] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §d${player.nameTag} §r>> §i${getDistanceXZ(player, entity).toFixed(3)} §r>> §u${entity.typeId}"}]}`);
	}
	if(config.debug && player.hasTag("logHits")) console.warn(player.getTags(), "rotation", rotation.x, rotation.y, "angleDiff", angleCalc(player, entity), "auraF" + getScore(player, "killauraF_buffer", 0), "killauraF_reset", getScore(player, "killauraF_reset", 0), "reach", fastSqrt(fastPow(entity.location.x - player.location.x, 2) + fastPow(entity.location.z - player.location.z, 2)));
});
world.afterEvents.entityHitBlock.subscribe((entityHit) => {
	const { damagingEntity: player} = entityHit;
	player.flagAutotoolA = false;
	player.lastSelectedSlot = player.selectedSlotIndex;
	player.startBreakTime = Date.now();
	player.autotoolSwitchDelay = 0;
	
});
world.beforeEvents.itemUse.subscribe((itemUse) => {
	const { source: player } = itemUse;

	if(player.typeId !== "minecraft:player") return;

	if(!player.hasTag("useItem")) {
		Minecraft.system.run(() => player.addTag("useItem"));
	}

	// Patch bypasses for the freeze system
	if(player.hasTag("freeze")) itemUse.cancel = true;
});

world.afterEvents.itemUse.subscribe((itemUse) => {
	const { itemStack: item, source: player } = itemUse;

	// itemUse can be triggered from entities
	if(player.typeId !== "minecraft:player") return;

	if(config.customcommands.ui.enabled && player.hasTag("op") && item.typeId === config.customcommands.ui.ui_item && item.nameTag === config.customcommands.ui.ui_item_name) {
		mainGui(player);
	}
});
// when using /reload, the variables defined in playerJoin don't persist
if([...world.getPlayers()].length >= 1) {
	for(const player of world.getPlayers()) {
		if(config.modules.nukerA.enabled) player.blocksBroken = 0;
		if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
		if(config.modules.fastuseA.enabled) player.lastThrow = Date.now() - 200;
		if(config.modules.autoclickerA.enabled) player.cps = 0;
		if(config.modules.killauraC.enabled) player.entitiesHit = [];
		if(config.customcommands.report.enabled) player.reports = [];

		player.lastGoodPosition = player.location;
	}
};
