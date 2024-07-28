// @ts-check
// @ts-ignore
import * as Minecraft from "@minecraft/server";
import { tag_system, aroundAir, add_effect} from "./utils/gameUtil.js";
import { getBlocksBetween, angleCalc } from "./utils/mathUtil.js";
import { flag, banMessage, getClosestPlayer, getScore, setScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui } from "./features/ui.js";
import { joinData } from "./utils/acUtil.js";

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
import { motion_d } from "./checks/movement/motion/motionD.js";
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
import { tower_b } from "./checks/world/scaffold/towerB.js";
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
import { aim_e } from "./checks/combat/aim/aimE.js";
import { autoclicker_e } from "./checks/combat/autoclicker/autoclickerE.js";

const world = Minecraft.world;
const system = Minecraft.system;

let lagValue = 1;

// Maps for logging data that we use in checks
const lastMessage = new Map();
const lastXZv = new Map();
const speedCLog = new Map();
const dmg_data = new Map();
const tp_data = new Map();


if(config.debug) console.warn(`${new Date().toISOString()} | Isolate - Load success`);
let currentVL;
world.beforeEvents.chatSend.subscribe((msg) => {
	const message = msg.message.toLowerCase();
	const player = msg.sender;

	if(config.debug && message === "ping") console.warn(`${new Date().toISOString()} | Pong!`);

	if(message.includes("the best minecraft bedrock utility mod") || message.includes("disepi/ambrosial")) {
		msg.cancel = true;
		
	}
	if(lastMessage) {
		if(lastMessage.get(player) === message) {
			msg.cancel = true;
			player.sendMessage("§cPlease do not repeat yourself");
		}
	}

	lastMessage.set(player, message);

	if(player.hasTag("isMuted")) {
		msg.cancel = true;
		player.sendMessage("§r§j[§uIsolate§j]§r §1§lNOPE! §r§cYou have been muted.");
	}

	commandHandler(msg);

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
		currentVL++;

	// Spammer/B = checks if someone sends a message while swinging their hand
	if(config.modules.spammerB.enabled && player.hasTag('left') && !player.getEffect(Minecraft.MinecraftEffectTypes.miningFatigue))
		return flag(player, "Spammer", "B", "Combat", undefined, undefined, true, msg);
		currentVL++;

	// Spammer/C = checks if someone sends a message while using an item
	if(config.modules.spammerC.enabled && player.hasTag('right'))
		return flag(player, "Spammer", "C", "Misc", undefined, undefined, true, msg);
		currentVL++;
	// Spammer/D = checks if someone sends a message while having a GUI open
	if(config.modules.spammerD.enabled && player.hasTag('hasGUIopen'))
		return flag(player, "Spammer", "D", "Misc", undefined, undefined, true, msg);
		currentVL++;


	// commandHandler(player, msg);
});

world.afterEvents.entityHurt.subscribe((data) => {
	const player = data.hurtEntity;

	if(player.typeId !== "minecraft:player") return;
	player.addTag("damaged");
	if(data.damageSource.cause === "fall") {
		player.addTag("fall_damage");
	}
	dmg_data.set(player.name, Date.now());
	if(config.debug) console.warn(`${new Date().toISOString()} |${player.name} was damaged!`);
	
});

Minecraft.system.runInterval(() => {
  if (config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;

	// Run the code for each player
	for (const player of world.getPlayers()) {

		// Gud calculations :fire:
		const rotation = player.getRotation();
		const playerVelocity = player.getVelocity();
		const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(4));
				
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
			currentVL++;
		}
		if(player.flagNamespoofB) {
			flag(player, "Namespoof", "B", "Exploit");
			player.flagNamespoofB = false;
			currentVL++;
		}


		// player position shit
		if(player.hasTag("moving")) {
			player.runCommandAsync(`scoreboard players set @s xPos ${Math.floor(player.location.x)}`);
			player.runCommandAsync(`scoreboard players set @s yPos ${Math.floor(player.location.y)}`);
			player.runCommandAsync(`scoreboard players set @s zPos ${Math.floor(player.location.z)}`);
		}

		// Im currently adding more management for the strict system, it wont be a full system it will just be there to help prevent false flags
		if(getScore(player, "kickvl", 0) > config.modules.settings.ViolationsBeforeBan / 2 && !player.hasTag("strict")) {
			//Try add the tag
			try {
				player.addTag("strict");
			} catch (error) {
				// If .addTag() fails we use commands
				player.runCommandAsync(`tag "${player.name}" add strict`);
			}
		}

		if(player.hasTag("runUI")) {
			player.removeTag("runUI")
			mainGui(player);
		}
		
		if(config.modules.settings.autoReset) {
			if(getScore(player, "tick_counter2", 0) > 300) {
				if(!player.hasTag("reported") && player.hasTag("strict")) {
					player.removeTag("strict");
				}
				player.runCommandAsync("function tools/resetwarns");
				setScore(player, "tick_counter2", 0);
			}
		}
		if(player.hasTag("moving") && config.debug && player.hasTag("log")) {
			console.warn(`${player.nameTag} speed is ${playerSpeed} Velocity.X ${playerVelocity.x}, Y ${playerVelocity.y}, Z ${playerVelocity.z}`);
		}

		const blockBelow = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z}) ?? {typeId: "minecraft:air"};
		const blockTags = ["ice", "slime", "end_portal", "stairs"];
		blockTags.forEach(tag => {
			if (blockBelow.typeId.includes(tag)) {
				player.addTag(tag);
			}
		});
		if (player.hasTag("trident")) {
			setScore(player, "right", 0);
		}


		tag_system(player);


		// AirTime 
		const flyTime = getScore(player, "airTime", 0);
		if(!player.isOnGround && !player.hasTag("ground") && aroundAir(player)) {
			setScore(player, "airTime", flyTime + 1);
		} else {
			setScore(player, "airTime", 0)
		}

  
		const tickValue = getScore(player, "tickValue", 0);                                      
		// The flag system and the counter and summon system
		if(player.hasTag("slime")) {
			setScore(player, "tick_counter2", 0);
		}
		// Store the players last good position
		// When a movement-related check flags the player, they will be teleported to this position
		// xRot and yRot being 0 means the player position was modified from player.teleport, which we should ignore
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
			motion_d(player);
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
		}

		if(config.generalModules.aim) {
			aim_a(player);
			aim_b(player);
			aim_c(player);
			aim_b(player);
			aim_e(player);
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
			killaura_d(player);
		}
		// Remove tags for checks :D
		player.removeTag("attacking");
		player.removeTag("usingItem");
		player.removeTag("breaking");
		player.removeTag("leftv2");
		
		if(tickValue > 19) {
			const currentCounter = getScore(player, "tick_counter", 0);
			setScore(player, "tick_counter", currentCounter + 1);
			setScore(player, "tick_counter2", getScore(player, "tick_counter2", 0) + 1);
			setScore(player, "tag_reset", getScore(player, "tag_reset", 0) + 1);
			setScore(player, "aimc_reset", getScore(player, "aimc_reset", 0) + 1);
			setScore(player, "motion_c_data", 0);
			badpackets_e(player);
			if(player.hasTag("packetlogger")) player.runCommandAsync(`title @s actionbar packets:${getScore(player, "packets", 0)}`);
			setScore(player, "packets", 0);
			player.removeTag("snow");
			
		}
		if(getScore(player, "tag_reset", 0) > 5) {
			const removalTags = [
				"slime", "placing", "ice", "fall_damage", 
				"end_portal", "stairs", "timer_bypass", "ender_pearl", 
				"useItem", "interactBlock", "speedE_pass", "fighting"
			];
			removalTags.forEach(tag => player.removeTag(tag));
			setScore(player, "tag_reset", 0);
		}
		if(teleportCheck(player)) {
			player.addTag("teleport")
			tp_data.set(player.date, Date.now())
		}
		if(player.hasTag("damaged") && Date.now() - dmg_data.get(player.name) >= 4000) {
			player.removeTag("damaged");
		}
		if(player.hasTag("teleport") && Date.now() - dmg_data.get(player.name) >= 4000) {
			player.removeTag("teleport");
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
	const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
	if(config.debug) console.warn(`${player.nameTag} has placed ${block.typeId}. Speed: ${playerSpeed} Distance: ${Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.z - player.location.z, 2))} Player X Rotation: ${rotation.x} Player Y Rotation: ${rotation.y}`);
	
	
	let undoPlace = false; 
	// ==================================
	//               Scaffold Checks
	// ==================================
	//   The best in the game

	if(config.generalModules.scaffold && !player.hasTag("noscaffold")) {
		scaffold_a(player, block);
		scaffold_b(player, block);
		scaffold_c(player, block);
		scaffold_e(player);
		scaffold_f(player, block);
		tower_a(player, block);
		tower_b(player, block);
	}

	reach_c(player, block);
	// This is used for other checks
	if(!player.hasTag("placing")) {
		player.addTag("placing");
	}

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
	if(config.modules.settings.hiveRegen) {
		if(brokenBlockId === "minecraft:redstone_ore" || brokenBlockId === "minecraft:lit_redstone_ore") {
			add_effect(player, "absorption", 10, 1);
		}
	}

	if(config.debug) console.warn(`${player.nameTag} has broken the block ${blockBreak.brokenBlockPermutation.type.id}`);
	


	// Reach/B = checks for breaking blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach")) {
		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
		if(distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "Breaking", "distance", distance, false);
			revertBlock = true;
		}
	}

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
		currentVL++;
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
			currentVL++;
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
	const tagsToRemove = ["attack", "hasGUIopen", "right", "left", "ground", "gliding", "sprinting", "moving", "sleeping"];
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

	const lst = JSON.parse(world.getDynamicProperty("offlineList"));
	const bnlst = JSON.parse(world.getDynamicProperty("banList"));
	// If user is in offline ban list, add ban and remove from list
	for (const dat of lst) {
		if (lst[dat][0] === player.name) {
			player.addTag(`reason:${lst[dat][1]}`);
			player.addTag(`by:${lst[dat][2]}`);
			if(typeof lst[dat][3] === "number") player.addTag(`time:${Date.now() + lst[dat][3]}`);
			player.addTag("isBanned");

			// Remove player from the list
			delete lst[dat];
			world.setDynamicProperty("offlineList", JSON.stringify(lst));

			// Add the player to the banned players list
			bnlst[player.name] = [player.nameTag, lst[dat][1], lst[dat][2], Date.now(), lst[dat][3]];
			world.setDynamicProperty("banList", JSON.stringify(bnlst));
		}
	}

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
			currentVL++;
			entity.kill();
		}

		if (npcCheck) {
			entity.runCommandAsync("scoreboard players operation @s npc = scythe:config npc");
			entity.runCommandAsync("testfor @s[scores={npc=1..}]").then((commandResult) => {
				if (commandResult.successCount < 1) return;
				const closestPlayer = getClosestPlayer(entity);
				flag(closestPlayer, "CommandBlockExploit", "G", "Exploit", "entity", entityTypeId);
				currentVL++;
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

	
	if(config.generalModules.killaura && !player.hasTag("noaura")) {
		killaura_a(player, entity);
		killaura_b(player, system, entity);
		killaura_c(player, entity, player.entitiesHit);
		// @ts-ignore
		killaura_d(player, 1);
		killaura_e(player);
		killaura_f(player, 1);
	}

	hitbox_a(player, entity);
	reach_a(player, entity);
	reach_b(player, entity);
	
	badpackets_c(player, entity);

	if(config.modules.autoclickerA.enabled ||config.modules.autoclickerB.enabled || config.modules.autoclickerC.enabled || config.modules.autoclickerD.enabled) {
		player.cps++;
	}
	

	if(config.debug && player.hasTag("logHits")) console.warn(player.getTags(), "rotation", rotation.x, "angleDiff", angleCalc(player, entity), "auraF" + getScore(player, "killauraF_buffer", 0), "killauraF_reset", getScore(player, "killauraF_reset", 0), "reach", Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2)));
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
