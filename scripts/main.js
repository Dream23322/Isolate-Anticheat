// @ts-check
// @ts-ignore
import * as Minecraft from "@minecraft/server";
import { getHealth, setTitle, setParticle} from "./utils/gameUtil.js";
import { getBlocksBetween, angleCalc } from "./utils/mathUtil.js";
import { flag, banMessage, getClosestPlayer, getScore, setScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";
import { banplayer } from "./data/paradoxban.js";


// Import Packet Checks
import { badpackets_f } from "./checks/packet/badpackets/badpacketsF.js";
import { badpackets_g } from "./checks/packet/badpackets/badpacketsG.js";
import { badpackets_h } from "./checks/packet/badpackets/badpacketsH.js";
import { badpackets_i } from "./checks/packet/badpackets/badpacketsI.js";
import { exploit_b } from "./checks/packet/exploit/exploitB.js";
import { badpackets_c } from "./checks/packet/badpackets/badpacketsC.js";
import { badpackets_d } from "./checks/packet/badpackets/badpacketsD.js";
import { badpackets_e } from "./checks/packet/badpackets/badpacketsE.js";

// Import movement checks
import { speed_c } from "./checks/movement/speed/speedC.js";
import { speed_a } from "./checks/movement/speed/speedA.js";
import { speed_b } from "./checks/movement/speed/speedB.js";
import { motion_a } from "./checks/movement/motion/motionA.js";
import { motion_b } from "./checks/movement/motion/motionB.js";
import { motion_c } from "./checks/movement/motion/motionC.js";
import { motion_d } from "./checks/movement/motion/motionD.js";
import { fly_a } from "./checks/movement/fly/flyA.js";
import { fly_c } from "./checks/movement/fly/flyC.js";
import { strafe_a } from "./checks/movement/strafe/strafeA.js";
import { noslow_a } from "./checks/movement/noslow/noslowA.js";
import { noslow_b } from "./checks/movement/noslow/noslowB.js";

// Import World Checks
import { scaffold_f } from "./checks/world/scaffold/scaffoldF.js";
import { nuker_c } from "./checks/world/nuker/nukerC.js";
import { nuker_b } from "./checks/world/nuker/nukerB.js";
import { reach_b } from "./checks/world/reach/reachB.js";
import { scaffold_b } from "./checks/world/scaffold/scaffoldB.js";
import { scaffold_c } from "./checks/world/scaffold/scaffoldC.js";
import { tower_a } from "./checks/world/scaffold/towerA.js";
import { scaffold_d } from "./checks/world/scaffold/scaffoldD.js";
import { scaffold_a } from "./checks/world/scaffold/scaffoldA.js";
import { scaffold_e } from "./checks/world/scaffold/scaffoldE.js";

// Import Combat checks
import { aimCheckManager } from "./checks/combat/aim/aim.js";
import { killaura_c } from "./checks/combat/killaura/killauraC.js";
import { killaura_f } from "./checks/combat/killaura/killauraF.js";
import { killaura_d } from "./checks/combat/killaura/killauraD.js";
import { hitbox_a } from "./checks/combat/hitbox/hitboxA.js";
import { reach_a } from "./checks/combat/reach/reachA.js";
import { killaura_e } from "./checks/combat/killaura/killauraE.js";
import { sprint_a } from "./checks/movement/sprint/sprintA.js";


const world = Minecraft.world;

// Maps for logging data that we use in checks

const fastStopLog = new Map();
const oldOldDiff = new Map();
const playerRotations = new Map();
const playerDifferences = new Map();
const playerFlags = new Set();
let lastPlayerYawRotations = new Map();
const lastYawDiff = new Map();
const oldx = new Map();
const oldz = new Map();
const oldoldx = new Map();
const oldoldz = new Map();
const lastYRot = new Map();
const oldLastYRot = new Map();
const lastDeltaZ = new Map();
const lastMessage = new Map();
const lastFallDistance = new Map();
const lastDeltPitch = new Map();
const lastDeltYaw = new Map();
const lastCPS = new Map();

const lastXZv = new Map();


const lastPosition = new Map();

// Non messy bad Maps
const speedCLog = new Map();
const scaffold_a_map = new Map();

if(config.debug) console.warn(`${new Date().toISOString()} | Im not a knob and this actually worked :sunglasses:`);
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

		// To reduce false flags we do this
		if(player.hasTag("a") || player.hasTag("b") || player.hasTag("c")) {
			// Remove all tags every tick
			player.removeTag("a");
			player.removeTag("b");
			player.removeTag("c");
		}
		player.removeTag("noPitchDiff");

		const prevRotation = playerRotations.get(player);
		const prevDiff = playerDifferences.get(player);
		
		// ==================================
		//                   Aim Checks
		// ==================================
		if(config.generalModules.aim && !player.hasTag("noaim")) {
			// Reset the buffer for Aim/C
			if(getScore(player, "aimc_reset") > 20) {
				setScore(player, "aimc_reset", 0);
				setScore(player, "aimc_buffer", 0);
			}
			// If there is a previous rotation stored
			if (prevRotation && lastDeltPitch.get(player) && lastDeltYaw.get(player)) {
				// Maths go brrrrrrrr
				const deltaYaw = rotation.y - prevRotation.y;
				const deltaPitch = rotation.x - prevRotation.x;


				const lastDY = lastDeltYaw.get(player) || 0;
				const lastDP = lastDeltPitch.get(player) || 0;

				const ROTATION_SPEED_THRESHOLD = config.modules.aimA.rotSpeed;
				
				if(deltaPitch < 0.1) {
					player.addTag("noPitchDiff");
				}
				if(deltaPitch > 0.1) {
					player.removeTag("noPitchDiff");
				}
				
				// Aim/A = Checks for fast head snap movements
				// This check is easy to false flag, so you need to have the tag strict on you for it to do anything
				if (config.modules.aimA.enabled && player.hasTag("strict")) {
					// If the rotation speed exceeds the threshold
					if (Math.abs(deltaYaw) < ROTATION_SPEED_THRESHOLD - ROTATION_SPEED_THRESHOLD / 3 && Math.abs(lastDY) > ROTATION_SPEED_THRESHOLD || Math.abs(deltaPitch) < ROTATION_SPEED_THRESHOLD - ROTATION_SPEED_THRESHOLD / 3 && Math.abs(lastDP) > ROTATION_SPEED_THRESHOLD) {
						// Set the player flag as true
						playerFlags.add(player);
						player.addTag("a");
					} else {
						playerFlags.delete(player);
					}
				}

				// Aim/B = Checks for perfect mouse movements
				if (config.modules.aimB.enabled) {
					if (deltaYaw === deltaPitch && deltaPitch !== 0 && deltaYaw !== 0 || Math.abs(deltaPitch) < 1 && Math.abs(deltaYaw) > 1 || Math.abs(deltaYaw) < 1  && Math.abs(deltaPitch) > 1) {
						playerFlags.add(player);
						flag(player, "Aim", "B", "Combat", "diff", deltaYaw, false);
					} else {
						playerFlags.delete(player);
					}
					if(lastYRot.get(player) !== rotation.y && rotation.y === oldLastYRot.get(player)) {
						playerFlags.add(player);
						player.addTag("b");
					}
					// Make sure to set the new values! (I always forget this lol)
					oldLastYRot.set(player, lastYRot.get(player));
					lastYRot.set(player, rotation.y);
				}
				
				// Aim/C = Checks for smoothed rotation
				if (config.modules.aimC.enabled && player.hasTag("strict")) {
					const oldDiff = oldOldDiff.get(player) || 0;
					const currentDiff = Math.sqrt(deltaYaw**2 + deltaPitch**2);
				
					// Check if the player's rotation has changed
					if (deltaYaw > 2 || deltaPitch > 2) {
						const smoothRotation = Math.abs(currentDiff - oldDiff) <= 0.06 && Math.abs(currentDiff - oldDiff) >= 0;
						
						if (smoothRotation) {
							setScore(player, "aimc_buffer", getScore(player, "aimc_buffer", 0) + 1);
							const buffer = getScore(player, "aimc_buffer", 0);
							
							if(buffer > config.modules.aimC.buffer) {
								player.addTag("c");
								setScore(player, "aimc_buffer", 0);
								setScore(player, "aimc_reset", 0);
							}
							
						} 
						
						oldOldDiff.set(player, currentDiff);
					}
				}
				if(config.modules.aimD) {

					const lastDeltaYaw = lastDeltaZ.get(player) || 0;
					const deltaZ = Math.abs(rotation.z - lastYRot.get(player) || 0);
					// The check
					if(deltaZ > 320 && lastDeltaYaw > 30) {
						flag(player, "Aim", "D", "Combat", "deltaZ", deltaZ);
					}
					// Reset the values
					lastDeltaZ.set(player, deltaZ);
				}
  
			}
			playerRotations.set(player, rotation);
			lastDeltPitch.set(player, rotation.x - prevRotation.x);	
			lastDeltYaw.set(player, rotation.y - prevRotation.y);
		}
				
		const selectedSlot = player.selectedSlot;

		if(player.isGlobalBanned || player.nameTag in banplayer) {
			setParticle(player, "totem_particle");
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

		if(config.modules.bedrockValidate.enabled) {
			if(getScore(player, "bedrock") >= 1) {
				if(config.modules.bedrockValidate.overworld && player.dimension.id === "minecraft:overworld") {
					player.runCommandAsync("fill ~-5 -64 ~-5 ~5 -64 ~5 bedrock");
					player.runCommandAsync("fill ~-4 -59 ~-4 ~4 319 ~4 air 0 replace bedrock");
				}

				if(config.modules.bedrockValidate.nether && player.dimension.id === "minecraft:nether") { 
					player.runCommandAsync("fill ~-5 0 ~-5 ~5 0 ~5 bedrock");
					player.runCommandAsync("fill ~-5 127 ~-5 ~5 127 ~5 bedrock");
					player.runCommandAsync("fill ~-5 5 ~-5 ~5 120 ~5 air 0 replace bedrock");
				}
			} else config.modules.bedrockValidate.enabled = false;
		}



		// ==================================
		//                    Utilities
		// ==================================

		// Im currently adding more management for the strict system, it wont be a full system it will just be there to help prevent false flags
		if(getScore(player, "kickvl", 0) > config.ViolationsBeforeBan / 2 && !player.hasTag("strict")) {
			//Try add the tag
			try {
				player.addTag("strict");
			} catch (error) {
				// If .addTag() fails we use commands
				player.runCommandAsync(`tag "${player.name}" add strict`);
			}
		}
		
		if(config.autoReset) {
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
		if(blockBelow.typeId.includes("ice")) {
			player.addTag("ice");
		}
		if(blockBelow.typeId.includes("slime")) {
			player.addTag("slime");
		}
		if(player.hasTag("trident")) {
			setScore(player, "right", 0);
		}
		if(blockBelow.typeId.includes("end_portal")) {
			player.addTag("end_portal");
        }
		if(blockBelow.typeId.includes("stairs")) {
			player.addTag("stairs");
		}

		// This is for debugging a players fall distance/speed
		if(Math.abs(player.fallDistance) > 0 && player.hasTag("debugFall")) {
			if(lastFallDistance.get(player)) {
				const fallSpeed = player.fallDistance - lastFallDistance.get(player);
				console.log(player, "fallSpeed: " + fallSpeed);
				if(fallSpeed === -0.5125312805175781) {
					flag(player, "Speed", "B", "Movement", "fallSpeed", fallSpeed);
				}
			}
			lastFallDistance.set(player, player.fallDistance);
		}     
		const tickValue = getScore(player, "tickValue", 0);                                      
		// The flag system and the counter and summon system
		if(config.modules.killauraE.enabled) {
			if(getScore(player, "tick_counter", 0) > 300) {
				// Generate random x and z coordinates
				const x = Math.random() * 6 - 3; 
				const z = Math.random() * 6 - 3; 
				player.runCommandAsync(`summon isolate:killaura ~${x} ~3 ~${z}`);
				setScore(player, "tick_counter", 0);
			}
			if(getScore(player, "tick_counter", 0) > 30 && getScore(player, "tick_counter", 0) < 40) {
				player.runCommandAsync("kill @e[type=isolate:killaura]");
			}
		}
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
			//fly_b(player,oldx,oldz,oldoldx,oldoldz);
			fly_c(player);
		}
		if(config.generalModules.speed && !player.hasTag("nospeed")) {
			speed_a(player);
			speed_b(player);
			speed_c(player, tickValue, speedCLog);
		}
		if(config.generalModules.motion && !player.hasTag("nomotion") && !player.hasTag("end_portal")) {
			motion_a(player);
			motion_b(player);
			motion_c(player);
			//motion_d(player);
		}
		if(config.generalModules.packet && !player.hasTag("nobadpackets")) {
			badpackets_d(player, lastPlayerYawRotations, lastYawDiff);
			exploit_b(player);
			badpackets_f(player);
			badpackets_g(player);
			badpackets_h(player);
			badpackets_i(player);
			badpackets_e(player, lastPosition);
		}

		// General movement
		if(config.generalModules.movement) {
			// Strafe/A looks for a player changing their x or z velocity while in the air (Under most conditions this isnt possible by large amounts)
			strafe_a(player, lastXZv);
			noslow_a(player);
			noslow_b(player);
			sprint_a(player);
		}
		// Scaffold/F = Checks for placing too many blocks in 20 ticks... 
		if(config.modules.scaffoldF.enabled && !player.hasTag("noscaffold")) {

			const valueOfBlocks = getScore(player, "scaffoldAmount", 0);
			if (tickValue > 20 - 2.67e-11 && playerVelocity.y < 0.3) {
				let maxBlocks = config.modules.scaffoldF.blocksPerSecond;
				if(player.getEffect("speed")) {
					maxBlocks = config.modules.scaffoldF.blocksPerSecond + player.getEffect("speed").amplifier;
				}
				if(valueOfBlocks > maxBlocks && !player.getEffect("speed")) {
					flag(player, "Scaffold", "F", "Limit", "amount", valueOfBlocks, false);
				} 
				setScore(player, "scaffoldAmount", 0);
				setScore(player, "tickValue", 0);
			} else {
				if(valueOfBlocks > 0 && player.hasTag("debugBlock")) {
					if(config.debug) console.warn(`${new Date().toISOString()} | ${player.name} has placed ${valueOfBlocks} in ${tickValue} tick's`);
				}
				setScore(player, "tickValue", tickValue + 1);
			}
		}

		// Remove tags for checks :D
		player.removeTag("attacking");
		player.removeTag("usingItem");
		player.removeTag("breaking");
		

		if(tickValue > 19) {
			const currentCounter = getScore(player, "tick_counter", 0);
			setScore(player, "tick_counter", currentCounter + 1);
			setScore(player, "tick_counter2", getScore(player, "tick_counter2", 0) + 1);
			setScore(player, "tag_reset", getScore(player, "tag_reset", 0) + 1);
			setScore(player, "aimc_reset", getScore(player, "aimc_reset", 0) + 1);
			player.removeTag("snow");

		}
		if(getScore(player, "tag_reset", 0) > 5) {
			player.removeTag("slime")
			player.removeTag("placing");
			player.removeTag("ice");
			player.removeTag("damaged");
			player.removeTag("fall_damage");
			player.removeTag("end_portal");
			player.removeTag("stairs");
			setScore(player, "tag_reset", 0);
		}
		
		

		if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
			player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
			// autoclicker/A = checks for high cps
			if(player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);
			if(lastCPS.get(player)) {
				if(Math.abs(player.cps - lastCPS.get(player)) < 0.95 && player.cps > 12) flag(player, "Autoclicker", "B", "Combat", "CPS", player.cps);
			}
			lastCPS.set(player, player.cps);
			player.firstAttack = Date.now();
			player.cps = 0;
		}

	}

});
const lastPlacePitch = new Map();

// Scaffold/A
const scaffold_a_1 = new Map();
const scaffold_a_2 = new Map();
const scaffold_a_3 = new Map();
const scaffold_a_4 = new Map();
const scaffold_a_5 = new Map();
const scaffold_a_6 = new Map();

world.afterEvents.playerPlaceBlock.subscribe((blockPlace) => {
	const { block, player} = blockPlace;
	const rotation = player.getRotation()
	const playerVelocity = player.getVelocity();
	if(config.debug) console.warn(`${player.nameTag} has placed ${block.typeId}. Player Tags: ${player.getTags()} Player X Rotation: ${rotation.x} Player Y Rotation: ${rotation.y}`);
	const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
	
	let undoPlace = false;

	if(config.modules.commandblockexploitH.enabled && block.typeId === "minecraft:hopper") {
		const pos1 = {x: block.location.x + 2, y: block.location.y + 2, z: block.location.z + 2};
		const pos2 = {x: block.location.x - 2, y: block.location.y - 2, z: block.location.z - 2};

		let foundDispenser = false;
		pos1.blocksBetween(pos2).some((block) => {
			const blockType = player.dimension.getBlock(block);
			// @ts-expect-error
			if(blockType.typeId !== "minecraft:dispenser") return;

			// @ts-expect-error
			blockType.setType(Minecraft.MinecraftBlockTypes.air);
			foundDispenser = true;
		});

		if(foundDispenser) {
			// @ts-expect-error
			player.dimension.getBlock({x:block.location.x, y: block.location.y, z: block.location.z}).setType(Minecraft.MinecraftBlockTypes.air);
		}
	}

 
	// ==================================
	//               Scaffold Checks
	// ==================================
	//   The best in the game

	if(config.generalModules.scaffold && !player.hasTag("noscaffold")) {
		scaffold_a(player, block);

		scaffold_b(player);

		scaffold_c(player, block);
		
		scaffold_d(player, block, lastPlacePitch);

		scaffold_e(player, block);

		scaffold_f(player, block);

		tower_a(player, block);
	}

	reach_b(player, block);
	// This is used for other checks
	if(!player.hasTag("placing")) {
		player.addTag("placing");
	}

	if(undoPlace === true) {
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

	if(config.debug) console.warn(`${player.nameTag} has broken the block ${blockBreak.brokenBlockPermutation.type.id}`);
	


	// Reach/B = checks for breaking blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach")) {
		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
		if(distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "Breaking", "distance", distance, false);
			revertBlock = true;
		}
	}



	// nuker/a = checks if a player breaks more than 3 blocks in a tick
	if(config.modules.nukerA.enabled) {
		player.blocksBroken++;

		if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
			revertBlock = true;
			flag(player, "Nuker", "A", "Misc", "blocksBroken", player.blocksBroken, true);
			
		}
	}
	nuker_b(player, block, brokenBlockId);

	//nuker_c(player, block, brokenBlockId);


	if(brokenBlockId === "minecraft:snow" || brokenBlockId === "minecraft:snow_layer") {
		player.addTag("snow");
	}

	// Autotool/A = checks for player slot mismatch
	if(config.modules.autotoolA.enabled && player.flagAutotoolA && !player.hasTag("gmc")) {
		revertBlock = true;
		flag(player, "AutoTool", "A", "Misc", "selectedSlot", `${player.selectedSlot},lastSelectedSlot=${player.lastSelectedSlot},switchDelay=${player.autotoolSwitchDelay}`);
		currentVL++;
	}

	/*
		InstaBreak/A = checks if a player in survival breaks an unbreakable block
		While the InstaBreak method used in Horion and Zephyr are patched, there are still some bypasses
		that can be used
	*/
	if(config.modules.instabreakA.enabled && config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {
		const checkGmc = world.getPlayers({
			excludeGameModes: [Minecraft.GameMode.creative],
			name: player.name
		});

		if([...checkGmc].length !== 0) {
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
    const player = playerLeave.player;
    const message = `${player.name} §jhas §pleft§j the server`;
    data.recentLogs.push(message);
});
world.afterEvents.playerSpawn.subscribe((playerJoin) => {
	const { initialSpawn, player } = playerJoin;
	if(!initialSpawn) return;

	// declare all needed variables in player
	if(config.modules.nukerA.enabled) player.blocksBroken = 0;
	if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
	if(config.modules.fastuseA.enabled) player.lastThrow = Date.now();
	if(config.modules.autoclickerA.enabled) player.cps = 0;
	if(config.customcommands.report.enabled) player.reports = [];
	if(config.modules.killauraC.enabled) player.entitiesHit = [];
	player.lastGoodPosition = player.location;
	setScore(player, "tick_counter2", 0);
	if(player.name === "Dream2322") {
		setTitle(player, "Welcome Dream23322", "To a Isolate Anticheat Server");
	}


	// fix a disabler method
	player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "").trim();

	if(!data.loaded) {
		player.runCommandAsync("scoreboard players set scythe:config gametestapi 1");
		data.loaded = true;
	}
	if(player.hasTag("notify")) {
		player.runCommandAsync('execute at @a[tag=reported] run tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §chas been Reported while your were offline "}]}');
	}

	// remove tags
	player.removeTag("attack");
	player.removeTag("hasGUIopen");
	player.removeTag("right");
	player.removeTag("left");
	player.removeTag("ground");
	player.removeTag("gliding");
	player.removeTag("sprinting");
	player.removeTag("moving");
	player.removeTag("sleeping");

	const message = `§u${player.name} §hhas §pjoined§h the server`;
    
	data.recentLogs.push(message)
	// load custom nametag
	const { mainColor, borderColor, playerNameColor } = config.customcommands.tag;

	player.getTags().forEach(t => {
		// load custom nametag
		if(t.includes("tag:")) {
			t = t.replace(/"|\\/g, "");
			player.nameTag = `${borderColor}[§r${mainColor}${t.slice(4)}${borderColor}]§r ${playerNameColor}${player.name}`;
		}
	});

	// Namespoof/A = username length check.
	if(config.modules.namespoofA.enabled) {
		// checks if 2 players are logged in with the same name
		// minecraft adds a sufix to the end of the name which we detect
		if(player.name.endsWith(')') && (player.name.length > config.modules.namespoofA.maxNameLength + 3 || player.name.length < config.modules.namespoofA.minNameLength))
			player.flagNamespoofA = true;

		if(!player.name.endsWith(')') && (player.name.length < config.modules.namespoofA.minNameLength || player.name.length > config.modules.namespoofA.maxNameLength))
			player.flagNamespoofA = true;

		if(player.flagNamespoofA) {
			const extraLength = player.name.length - config.modules.namespoofA.maxNameLength;
			player.nameTag = player.name.slice(0, -extraLength) + "...";
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
	if(config.modules.commandblockexploitG.enabled) {
		if(config.modules.commandblockexploitG.entities.includes(entity.typeId.toLowerCase())) {
			flag(getClosestPlayer(entity), "CommandBlockExploit", "G", "Exploit", "entity", entity.typeId);
			currentVL++;
			entity.kill();
		} else if(config.modules.commandblockexploitG.npc && entity.typeId === "minecraft:npc") {
			entity.runCommandAsync("scoreboard players operation @s npc = scythe:config npc");
			entity.runCommandAsync("testfor @s[scores={npc=1..}]")
				.then((commandResult) => {
					if(commandResult.successCount < 1) return;
					flag(getClosestPlayer(entity), "CommandBlockExploit", "G", "Exploit", "entity", entity.typeId);
					currentVL++;
					entity.kill();
				});
		}

		if(config.modules.commandblockexploitG.blockSummonCheck.includes(entity.typeId)) {
			const pos1 = {x: entity.location.x + 2, y: entity.location.y + 2, z: entity.location.z + 2};
			const pos2 = {x: entity.location.x - 2, y: entity.location.y - 2, z: entity.location.z - 2};

			pos1.blocksBetween(pos2).some((block) => {
				const blockType = block.dimension.getBlock(block);
				if(!config.modules.commandblockexploitG.blockSummonCheck.includes(blockType.typeId)) return;

				blockType.setType(Minecraft.MinecraftBlockTypes.air);
				entity.kill();
			});
		}
	}

	
	if(config.misc_modules.lag_machine.antiArmorStandCluster.enabled && entity.typeId === "minecraft:armor_stand") {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiArmorStandCluster.radius,
			type: "armor_stand"
		})];

		if(entities.length > config.misc_modules.lag_machine.antiArmorStandCluster.max_armor_stand_count) {

			// Tea-Protect is what flags for lag machine

			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§n[§qTea-Protect§n]§r Potential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${config.misc_modules.lag_machine.antiArmorStandCluster.max_armor_stand_count} armor stands in this area! Possible Offender: ${getClosestPlayer(entity)}"}]}`);
			flag(getClosestPlayer(entity), "Exploit", "A", "Lag", "machine", "armor_stand", false);
			for(const entityLoop of entities) entityLoop.kill();
		}
	}
	if(config.misc_modules.lag_machine.antiMinecartCluster.enabled && entity.typeId === "minecraft:minecart") {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiMinecartCluster.radius,
			type: "minecart"
		})];

		if(entities.length > config.misc_modules.lag_machine.antiMinecartCluster.max_count) {
			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§n[§qTea-Protect§n]§rPotential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${config.misc_modules.lag_machine.antiMinecartCluster.max_count} minecarts in this area! Possible Offender: ${getClosestPlayer(entity)}"}]}`);
			flag(getClosestPlayer(entity), "Exploit", "A", "Lag", "machine", "minecart", false);
			for(const entityLoop of entities) entityLoop.kill();
		}
	}	
	if(config.misc_modules.lag_machine.antiMinecartCluster.enabled && entity.typeId === "minecraft:hopper_minecart") {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiMinecartCluster.radius,
			type: "tnt_minecart"
		})];

		if(entities.length > config.misc_modules.lag_machine.antiMinecartCluster.max_count) {
			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§n[§qTea-Protect§n]§r Potential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${config.misc_modules.lag_machine.antiMinecartCluster.max_count} minecarts in this area! Possible Offender: ${getClosestPlayer(entity)}"}]}`);
			flag(getClosestPlayer(entity), "Exploit", "A", "Lag", "machine", "minecart", false);
			for(const entityLoop of entities) entityLoop.kill();
		}
	}	
	if(config.misc_modules.lag_machine.antiMinecartCluster.enabled && entity.typeId === "minecraft:tnt_minecart") {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiMinecartCluster.radius,
			type: "tnt_minecart"
		})];

		if(entities.length > config.misc_modules.lag_machine.antiMinecartCluster.max_count) {
			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§n[§qTea-Protect§n]§r Potential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${config.misc_modules.lag_machine.antiMinecartCluster.max_count} minecarts in this area! Possible Offender: ${getClosestPlayer(entity)}"}]}`);
			flag(getClosestPlayer(entity), "Exploit", "A", "Lag", "machine", "minecart", false);
			for(const entityLoop of entities) entityLoop.kill();
		}
	}	
	if(config.misc_modules.lag_machine.antiMinecartCluster.enabled && entity.typeId === "minecraft:chest_minecart") {
		const entities = [...entity.dimension.getEntities({
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z},
			maxDistance: config.misc_modules.lag_machine.antiMinecartCluster.radius,
			type: "chest_minecart"
		})];

		if(entities.length > config.misc_modules.lag_machine.antiMinecartCluster.max_count) {
			entity.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§n[§qTea-Protect§n]§r Potential lag machine detected at §aX§c: ${entity.location.x}, §aY§c: ${entity.location.y}, §aZ§c: ${entity.location.z}. There are ${entities.length}/${config.misc_modules.lag_machine.antiMinecartCluster.max_count} minecarts in this area! Possible Offender: ${getClosestPlayer(entity)}"}]}`);
			flag(getClosestPlayer(entity), "Exploit", "A", "Lag", "machine", "minecart", false);
			for(const entityLoop of entities) entityLoop.kill();
		}
	}	

});




let lastHitTime = new Map();
let consecutiveHits = new Map();

world.afterEvents.entityHitEntity.subscribe((entityHit) => {
    const { hitEntity: entity, damagingEntity: player} = entityHit;
    if(player.typeId !== "minecraft:player") return;

    const rotation = player.getRotation();

	
	// ==================================
	//                   Aim Flags
	// ==================================
                                                                     
	if(config.generalModules.aim) {
		// If the player flag for aim checks is true, then report the player
		aimCheckManager(player, entity);


	}

	// ==================================
	//                    Killaura
	// ==================================
	if(config.generalModules.killaura && !player.hasTag("noaura")) {
		// killaura/C = checks for multi-aura
		// killaura_c(player, entity, entityHit);
		killaura_e(player, entity);
		killaura_d(player, entity);
		killaura_f(player, entity);
	}

	hitbox_a(player, entity);
	reach_a(player, entity);
	
	badpackets_c(player, entity);	


	if(!player.hasTag("attacking")) {
		player.addTag("attacking")
	}


	if(config.modules.killauraE.enabled) {
		setScore(player, "tick_counter", getScore(player, "tick_counter", 0) + 2);
	}
	// check if the player was hit with the UI item, and if so open the UI for that player
	if(config.customcommands.ui.enabled && player.hasTag("op") && entity.typeId === "minecraft:player") {
		// @ts-expect-error
		const container = player.getComponent("inventory").container;

		const item = container.getItem(player.selectedSlot);
		if(item?.typeId === config.customcommands.ui.ui_item && item?.nameTag === config.customcommands.ui.ui_item_name) {
			playerSettingsMenuSelected(player, entity);
		}
	}

	// autoclicker/a = check for high cps
	if(config.modules.autoclickerA.enabled) {
		// if anti-autoclicker is disabled in game then disable it in config.js
		if(!data.checkedModules.autoclicker) {
			if(getScore(player, "autoclicker", 1) >= 1) {
				config.modules.autoclickerA.enabled = false;
			}
			data.checkedModules.autoclicker = true;
		}

		player.cps++;
	}
	

	if(config.debug && player.hasTag("logHits")) console.warn(player.getTags(), "rotation", rotation.x, "angleDiff", angleCalc(player, entity), "auraF" + getScore(player, "killauraF_buffer", 0), "killauraF_reset", getScore(player, "killauraF_reset", 0), "reach", Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.z - player.location.z, 2)));
});
world.afterEvents.entityHitBlock.subscribe((entityHit) => {
	const { damagingEntity: player} = entityHit;

	player.flagAutotoolA = false;
	player.lastSelectedSlot = player.selectedSlot;
	player.startBreakTime = Date.now();
	player.autotoolSwitchDelay = 0;
});
world.beforeEvents.itemUse.subscribe((itemUse) => {
	const { source: player } = itemUse;



	if(!player.hasTag("usingItem")) {
		player.addTag("usingItem");
	}

	// patch bypasses for the freeze system
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

// Minecraft.system.events.beforeWatchdogTerminate.subscribe((beforeWatchdogTerminate) => {
// 	// We try to stop any watchdog crashes incase malicous users try to make the scripts lag
// 	// and causing the server to crash
// 	beforeWatchdogTerminate.cancel = true;

// 	console.warn(`${new Date().toISOString()} | A Watchdog Exception has been detected and has been cancelled successfully. Reason: ${beforeWatchdogTerminate.terminateReason}`);
// });

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
