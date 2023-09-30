// @ts-check
// @ts-ignore
import * as Minecraft from "@minecraft/server";
import { getHealth, playerTellraw, setTitle, setParticle, setSound, inAir, aroundAir} from "./utils/gameUtil.js";
import { getBlocksBetween, getSpeed, angleCalc, hVelocity } from "./utils/mathUtil.js";
import { flag, banMessage, getClosestPlayer, getScore, setScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";
import { banplayer } from "./data/paradoxban.js";

const world = Minecraft.world;

// Maps for logging data that we use in checks

const fastStopLog = new Map();
const oldOldSpeed = new Map();
const oldOldDiff = new Map();
const playerRotations = new Map();
const playerDifferences = new Map();
const playerFlags = new Set();
const oldYPos = new Map();
const oldOldYPos = new Map();
let lastPlayerYawRotations = new Map();
const lastYawDiff = new Map();
const oldx = new Map();
const oldz = new Map();
const oldoldx = new Map();
const oldoldz = new Map();
const lastYRot = new Map();
const oldLastYRot = new Map();
const lastDeltaZ = new Map();
let lastAttackVector2Angle = new Map();
const lastMessage = new Map();
const lastFallDistance = new Map();
const lastDeltPitch = new Map();
const lastDeltYaw = new Map();
const lastCPS = new Map();

const lastXZv = new Map();

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
						player.addTag("b");
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
		
		// Crasher/A = invalid pos check
		if(config.modules.crasherA.enabled && Math.abs(player.location.x) > 30000000 ||
			Math.abs(player.location.y) > 30000000 || Math.abs(player.location.z) > 30000000) 
				flag(player, "Crasher", "A", "Exploit", "x_pos", `${player.location.x},y_pos=${player.location.y},z_pos=${player.location.z}`, true);

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
		//                  Sprint Checks
		// ==================================
		if(config.generalModules.sprint) {
			// invalidsprint/a = checks for sprinting with the blindness effect
			if(config.modules.invalidsprintA.enabled && player.getEffect("blindness") && player.isSprinting)
				flag(player, "InvalidSprint", "A", "Movement", undefined, undefined, true);
				currentVL++;
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
		// Some little test thing
		if(player.hasTag("remove")) {
			player.removeTag("remove");
			player.remove()
		}

		// If player has the tag meme we do what alice anticheat cant
		if(player.hasTag("meme")) {
			if(player.hasTag("moving")) {
				flag(player, "Autowalk", "A", "Movement", "maths", "e+0.1-coffee", false);
			}
			if(player.hasTag("jump")) {
				flag(player, "Autojump", "A", "Movement", "maths", "energy = milk + coffee^2", false);
			}
			if(player.hasTag("cactus")) {
				flag(player, "Anticactus", "A", "Exploit", "maths", "e+0.1 x i need help", false);
			}
		}

		const blockBelow = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z}) ?? {typeId: "minecraft:air"};
		if(blockBelow.typeId.includes("ice")) {
			player.addTag("ice")
		}
		if(blockBelow.typeId.includes("slime")) {
			player.addTag("slime")
		}
		if(player.hasTag("trident")) {
			setScore(player, "right", 0)
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
		// ---------------------------------
		// Utilites for the killaura botw
		// ---------------------------------

		// The flag system and the counter and summon system
		if(config.modules.killauraE.enabled) {
			if(player.hasTag("killauraEFlag")) {
				flag(player, "Killaura", "E", "Combat", "Attacking Bot", "true", false);
				player.removeTag("killauraEFlag");
				setScore(player, "tick_counter", 290);
			}
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
		// ==================================
		//                   Fly Checks
		// ==================================
		if(config.generalModules.fly === true && !player.hasTag("nofly")) {

			// Fly/A = Old Fly/F
			if(config.modules.flyA.enabled) {
				if(aroundAir(player) === true && !player.getEffect("jump_boost")) {
					const currentYPos = player.location.y;
					const oldY = oldYPos.get(player) || currentYPos;

					if(!player.hasTag("nofly") && !player.hasTag("nofly") && !player.hasTag("damaged") && !player.isJumping && !player.isGliding) {
						//const simYPos = Math.abs(currentYPos - oldY) <= config.modules.flyF.diff && Math.abs(currentYPos - oldOldY) <= config.modules.flyF.diff;
						
						const prediction = (playerVelocity.y > 0.42 && aroundAir(player) === true && playerVelocity.y !== 1 || playerVelocity.y < -3.92 && aroundAir(player) === true) && playerVelocity.y !== -1 && playerVelocity.y > -9
						if(player.getEffect("speed") && player.getEffect("speed").amplifier > 5)  continue;
						if(prediction && getScore(player, "tick_counter2", 0) > 3 && player.fallDistance < 25) {
							flag(player, "Fly", "A", "Movement", "y-velocity", playerVelocity.y, false);
						}
					}
					oldOldYPos.set(player, oldY);
					oldYPos.set(player, currentYPos);
				}
			}

			// New Fly/B = old Fly/A
			if(config.modules.flyB.enabled) {
				if (config.modules.flyB.enabled && !player.hasTag("op") && !player.isFlying && !player.isOnGround && !player.isJumping && !player.hasTag("nofly") && !player.hasTag("damaged") && !player.isGliding) {
					// Checks for invalid downwards accelerations
					/*
						This is a mix of a bunch o different stuffs because too much random stuff spread out is
						1. Annoying to understand and handle
						2. Can cause performance issues with the server
					*/
					// Get all data
					const oldxp = oldx.get(player) || 0;
					const oldzp = oldz.get(player) || 0;
					const oldoldxp = oldoldx.get(player) || 0;
					const oldoldzp = oldoldz.get(player) || 0;

					// We calculate 2 diffferences so that we can compare the 2
					const diff1 = Math.abs(oldoldxp - oldxp);
					const diff2 = Math.abs(oldoldzp - oldzp);
					const diff3 = Math.abs(oldxp - player.location.x);
					const diff4 = Math.abs(oldzp - player.location.z);

					// Calculate the final differences
					const final1 = Math.abs(diff1 - diff2) / 2;
					const final2 = Math.abs(diff3 - diff4) / 2;

					// If the differences are the same, flag for fly/A
					
					if (final1 === final2 && final2 !== 0) {
						// if the player is in Air, continue to flag
						if(aroundAir(player)) {
							flag(player, "Fly", "B", "Movement", "difference", final1, false);
						}
					}

					// If the player is above world height, flag
					if(aroundAir(player) && player.location.y > 319 && !player.isOnGround && !player.hasTag("elytra")) {
						flag(player, "Fly", "B", "Movement", "y", player.location.y, false);
						player.teleport({x: player.location.x, y: player.location.y -150, z: player.location.z});
					}

					// Update all maps if the player is in air
					if(aroundAir(player) && !player.isOnGround) {
						oldx.set(player, player.location.x);
						oldz.set(player, player.location.z);
						oldoldx.set(player, oldxp);
						oldoldz.set(player, oldzp);
					}
				}
			}

			// Fly/C = Old fly/G
			if(config.modules.flyC.enabled && player.fallDistance < config.modules.flyC.fallDistance && !player.hasTag("trident") && !player.hasTag("ground") && !player.hasTag("nofly") && !player.hasTag("damaged") && player.hasTag("strict") && !player.hasTag("slime")) {
				// Stopping false flags
				if(!player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag("jump") && !player.hasTag("op")) {
					
					if(aroundAir(player) === true && Math.abs(playerVelocity.y) > 0.1) {
						flag(player, "Fly", "C", "Movement", "fallDistance", player.fallDistance, false);
					}	
				}
			}	



		}

		// ==================================
		//                 Speed Checks
		// ==================================f

		if(config.generalModules.speed && !player.hasTag("nospeed")) {
			// Speed/A = Checks for high speed

			// In speed/A we make sure we are still able to check players who have the speed effect! We do this by adding an estimate effect multiplier to the max speed.
			if(config.modules.speedA.enabled && hVelocity(player) > 0.05) {
				// Check if the player has an effect or not
				if(player.getEffect("speed")) {

					// Define everything that is needed
					const maxSpeed = config.modules.speedA.speed;
					const speedEffectValue = player.getEffect("speed").amplifier;
					let modifiedSpeed = maxSpeed; 
					
					// Add to the maxspeed value the corisponding amount
					for (let i = 0; i < speedEffectValue; i++) {
						// Add 0.3 to make sure there are no false flags
						modifiedSpeed += 0.3; 
					}

					// If the speed is higher than the max speed, flag the player for Speed/A
					if(playerSpeed > modifiedSpeed && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
						flag(player, "Speed", "A", "Movement", "speed", playerSpeed, true);
					}
					//modifiedSpeed = 0;

				} else {
					// If the player doesnt have the strict tag, be more tolerant
					if(!player.hasTag("strict")) {
						if(playerSpeed > config.modules.speedA.speed + 0.1 && !player.hasTag("strict") && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
							flag(player, "Speed", "A", "Movement", "speed", playerSpeed, true);
						}
					
					} else {
						// If the player doesnt have the the strict tag, be lesss tolerant
						if(playerSpeed > config.modules.speedA.speed && !player.hasTag("damaged") && !player.hasTag("op") && !player.isFlying && !player.hasTag("trident") && !player.hasTag("ice") && !player.hasTag("slime")) {
							flag(player, "Speed", "A", "Movement", "speed", playerSpeed, true);
						}
					}
				}
			}
			// Speed/B = Checks for bhop and vhop velocities

			if(config.modules.speedB.enabled) {
				if(playerSpeed > 0.2 && !player.hasTag("damaged") && !player.hasTag("ice") && !player.hasTag("slime")) {
					const yV = Math.abs(playerVelocity.y).toFixed(4);
					const prediction = yV === "0.1000" || yV === "0.4000" || yV === "0.6000" || yV === "0.8000" || yV === "0.9000" || yV === "0.0830" || yV === "0.2280" || yV === "0.3200" || yV === "0.2302" || yV === "0.0428" || yV === "0.1212" || yV === "0.0428" || yV === "1.1661" || yV === "1.0244";
					if(prediction) {
						flag(player, "Speed", "B", "Movement", "y-Velocity", yV, true);
					}
				}
			}

		}

		// ==================================
		//                 Motion Checks
		// ==================================
		if(config.generalModules.motion && !player.hasTag("nomotion")) {
			// Motion/A = Checks for very high speed in air
			if(config.modules.motionA.enabled && !player.hasTag("op")) {
				if(playerSpeed > config.modules.motionA.speed && !player.hasTag("ground")) {
					flag(player, "Motion", "A", "Movement", "speed", playerSpeed, true);
					player.addTag("strict");
				}
			}

			// Motion/B = checks for invalid vertical motion
			if(config.modules.motionB.enabled) {
				if(player.isFlying && playerSpeed > 2.29) {
					flag(player, "Motion", "B", "Movement", "speed", playerSpeed, true);
				}
			}

			// Motion/C = Checks for fly / glide / bhop like velocity
			if(config.modules.motionC.enabled && Math.abs(playerVelocity.y).toFixed(4) === "0.1552" && !player.isJumping && !player.isGliding && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
				const pos1 = {x: player.location.x - 2, y: player.location.y - 1, z: player.location.z - 2};
				const pos2 = {x: player.location.x + 2, y: player.location.y + 2, z: player.location.z + 2};

				const isInAir = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:air");
				if(isInAir && aroundAir(player)) flag(player, "Motion", "C", "Movement", "vertical_speed", Math.abs(playerVelocity.y).toFixed(4), true);
					else if(config.debug) console.warn(`${new Date().toISOString()} | ${player.name} was detected with Motion/C but was found near solid blocks.`);
			}

			// Motion/D = Checks for invalid movements
			if(config.modules.motionD.enabled) {
				if(player.fallDistance === 0 && player.hasTag("jumping") && player.isJumping) {
					flag(player, "Motion", "D", "Movement", "fallDistance", player.fallDistance, false);
				}
			}
		}

		// ==================================
		//                 Packet Checks
		// ==================================

		if(config.generalModules.packet && !player.hasTag("nobadpackets")) {
			//Badpackets/B = Checks for nopacket/blink movement
			if(config.modules.badpacketsB.enabled && !player.hasTag("op") && !player.getEffect("speed")) {
				if(playerSpeed > config.modules.badpacketsB.speed) {
					if(player.hasTag("ground")) {
						flag(player, "BadPackets", "B", "Movement", "speed", playerSpeed, true);
						player.addTag("strict");
					}
				}
			}

			// Checks for derp rotation (Really fast)
			if(config.modules.badpacketsD.enabled) {
				const currentRotation = player.getRotation();

				if (!lastPlayerYawRotations.has(player)) {
					lastPlayerYawRotations.set(player, currentRotation.y);
					continue;
				}
		
				const yawDiff = Math.abs(currentRotation.y - lastPlayerYawRotations.get(player));
				if(player.hasTag("logDiff")) {
					console.warn(`${new Date().toISOString()} |${player.name} rot diff = ${yawDiff}!`)
				}
				// Check for the condition
				// So, with the derp module, it changes the players rotation by 4 or 2, so its really really really easy to detect
				// There is another mode on it which BadPackets/F tries to detect, but its hard because of how it works
				if (yawDiff === 2 && lastYawDiff.get(player) === 4 || yawDiff === 4 && lastYawDiff.get(player) === 2 || yawDiff === 2 && lastYawDiff.get(player) === 2) {
					flag(player, "BadPackets", "D", "Rotation", "yawdiff", yawDiff, false)
					
				}

				// Update stored rotations
				lastPlayerYawRotations.set(player, currentRotation.y);
				lastYawDiff.set(player, yawDiff);
				
			}

			// Permission Spoof, so if someone is flying but doesnt have permission to fly
			if(config.modules.badpacketsH.enabled ) {
				if(player.isFlying && (!player.hasTag("op"))) {
					flag(player, "BadPackets","H", "Permision", "isFlying", "true", true);
					player.runCommandAsync(`ability "${player.name}" mayfly false`);
					setTitle(player, "Flying is not enabled", "Please turn it off");
				}
			}

			// Impossible Locations
			if(player.location.y < -104 && config.modules.exploitB.enabled) {
				player.teleport({x: player.location.x, y: -104, z: player.location.z});
				flag(player, "Exploit", "B", "Packet", "y pos", player.location.y);
			}

			// Checks for a players rotation being a flat number
			if((Number.isInteger(rotation.x) || Number.isInteger(rotation.y)) && rotation.x !== 0 && rotation.y !== 0 && rotation.x !== 90 && rotation.x !== 60) flag(player, "BadPackets", "F", "Rotation", "xRot",`${rotation.x},yRot=${rotation.y}`, true);

			// Impossible Rotations
			// Having your pitch over 90 isnt possible! Horion client might be able to do it
			if(Math.abs(rotation.x) > config.modules.badpacketsI.angle && config.modules.badpacketsI.enabled || Math.abs(rotation.x) === 54.09275817871094 && config.modules.badpacketsI.enabled) {
				flag(player, "BadPackets", "I", "Rotation", "angle", rotation.x, true);
			}
		
			// BadPackets/G = Checks for invalid actions
			// So like if someone attacks while placing a block, or if someone breaks and places a block, not possible!
			if(config.modules.badpacketsG.enabled) {
				if(player.hasTag("placing") && player.hasTag("attacking")) {
					flag(player, "BadPackets", "G", "Packet", "actions", "Placement, Attacking", false);
				}
				if(player.hasTag("placing") && player.hasTag("breaking") && !player.hasTag("snow")) {
					flag(player, "BadPackets", "G", "Packet", "actions", "Placement, Breaking", false);
				}
				if (player.hasTag("attacking") && player.hasTag("breaking")) {
					flag(player, "BadPackets", "G", "Packet", "actions", "Breaking, Attacking", false);
				}
				if(player.hasTag("usingItem") && (player.hasTag("attacking") || player.hasTag("placing") || player.hasTag("breaking"))) {
					flag(player, "BadPackets", "G", "Packet", "actions", "ItemUse, Attacking", false);
				}

				
			}

		}

		// General movement
		if(config.generalModules.movement) {

			// Velocity/A will be here

			// NoSlow/A = speed limit check
			if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed && !player.hasTag("ice") && !player.hasTag("slime") && !player.hasTag("no-noslow")) {
				if(!player.getEffect("speed") && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right") >= 5 && !player.hasTag("damaged")) {
					flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
					currentVL++;
				}
			}

			// NoSlow/B = Checks for speeding while in webs
			if(config.modules.noslowB.enabled && !player.hasTag("no-noslow")) {
				const pos1 = {x: player.location.x , y: player.location.y, z: player.location.z};
				const pos2 = {x: player.location.x, y: player.location.y, z: player.location.z};

				const isInWeb = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:web");
				if(player.hasTag("moving") && isInWeb && Math.abs(playerVelocity.y) < 0.1 && !player.getEffect("speed")) {
					flag(player, "NoSlow", "B", "Movement", "speed", playerSpeed, true);
				}
			}

			// Prediction/A = Checks for fast stop
			if(config.modules.predictionA.enabled && !player.hasTag("noprediction")) {
				if(playerSpeed === 0) {
					const lastSpeed = fastStopLog.get(player) || 0;
					const currentSpeed = getSpeed(player);

					// This checks for hovering with Fly or Using glide
					const prediction1 = playerVelocity.y === -0.9657211303710938 || playerVelocity.y === -0.02566051483154297;
					if(currentSpeed === 0 && lastSpeed > 0.22) {
						const pos1 = {x: player.location.x - 2, y: player.location.y, z: player.location.z - 2};
						const pos2 = {x: player.location.x + 2, y: player.location.y + 2, z: player.location.z + 2};
		
						const isInAir = !getBlocksBetween(pos1, pos2).some((block) => player.dimension.getBlock(block)?.typeId !== "minecraft:air");
						if(isInAir && playerSpeed === 0) {
							if(!player.isJumping && !player.hasTag("moving")) {
								flag(player, "Prediction", "A", "Movement", "lastSpeed", lastSpeed, false);
							}
						}
					}

					// Simple glide check (-0.01)
					if(prediction1) {
						flag(player, "Prediction", "A", "Movement", "yVelocity", playerVelocity.y, false);
					}
				}
			}
			
		}
	

		// ==================================
		//               Other Checks
		// ==================================

		// Scaffold/F = Checks for placing too many blocks in 20 ticks... 
		if(config.modules.scaffoldF.enabled && !player.hasTag("noscaffold")) {
			const tickValue = getScore(player, "tickValue", 0);
			const valueOfBlocks = getScore(player, "scaffoldAmount", 0);
			if (tickValue > 20 - 2.67e-11) {
				if(valueOfBlocks > config.modules.scaffoldF.blocksPerSecond) {
					flag(player, "Scaffold", "F", "Limit", "amount", valueOfBlocks, false);
				}
				setScore(player, "scaffoldAmount", 0);
				setScore(player, "tickValue", 0);
			} else {
				if(valueOfBlocks > 0) {
					if(config.debug) console.warn(`${new Date().toISOString()} | ${player.name} has placed ${valueOfBlocks} in ${tickValue} tick's`);
				}
				setScore(player, "tickValue", tickValue + 1);
			}
		}

		// Remove tags for checks :D
		player.removeTag("placing");
		player.removeTag("attacking");
		player.removeTag("usingItem");
		player.removeTag("breaking");
		
		const tickValue = getScore(player, "tickValue", 0);
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
			player.removeTag("ice");
			player.removeTag("damaged");
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

world.afterEvents.playerPlaceBlock.subscribe((blockPlace) => {
	const { block, player} = blockPlace;
	const rotation = player.getRotation()
	const playerVelocity = player.getVelocity();
	if(config.debug) console.warn(`${player.nameTag} has placed ${block.typeId}. Player Tags: ${player.getTags()} Player X Rotation: ${rotation.x}`);
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
		// Scaffold/a = checks for upwards scaffold
		// Need to improve this because its really easy to false flag
		if(config.modules.scaffoldA.enabled && playerSpeed < 0.2) {
			// get block under player
			const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
			
			// @ts-expect-error
			if(!player.isFlying && player.isJumping && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
				if(rotation.x < 65 && player.isJumping && playerSpeed < 0.2) {
					flag(player, "Scaffold", "A", "Placement", "rotation", rotation.x, false);
				}
			}
			if(player.getBlockFromViewDirection().id !== block.id && player.location.y > block.location.y) {
				flag(player, "Scaffold", "A", "Placement", "block", player.getBlockFromViewDirection().id, false);
			}
			
		}

		// Scaffold/B = Checks for a certain head rotation that horion clients scaffold uses (with bypass mode on), the rotation bypasses scaffold/C so that is why this is here
		if(config.modules.scaffoldB.enabled) {
			//const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
			if(!player.isFlying) {
				if(!player.hasTag("trident")) {
					if(rotation.x === 60 || rotation.x.toFixed(2) === "84.89" || rotation.x.toFixed(2) === "84.63") {
						flag(player, "Scaffold", "B", "Placement", "rotation", rotation.x, false);	
					}
				}
			}	
		}

		// Scaffold/C = Checks for not looking where you are placing, it has measures in place to not false with the dumb bedrock bridinging mechanics.
		if(config.modules.scaffoldC.enabled === true) {
			
			const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
			if(!player.isFlying && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
				// The actual check
				
				if(!player.hasTag("right") && !player.hasTag("jump") && !player.hasTag("trident") && player.hasTag("left") && rotation.x < config.modules.scaffoldC.angle) {
					flag(player, "Scaffold", "C", "Placement", "invalidKeypress", `!right,angle=${rotation.x}`, false);
					
				}
			}
		}
		
		// Scaffold/D = Checks for the item a player is holding not being the block the player placed
		if(config.modules.scaffoldD.enabled) {
			const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
			if(!player.isFlying && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
				// Get items and stuffs
				const container = player.getComponent('inventory').container;
				const selectedSlot = player.selectedSlot;
				const item = container.getItem(selectedSlot);

				// Check to see if the player doesnt place the held item
				if(item.typeId !== block.typeId) {
					flag(player, "Scaffold", "D", "Placement", "heldItem", `${item.typeId},blockId=${block.typeId}`, false);
					undoPlace = true;
				}
			}

			// If the blocks placement location cant be reached, flag
			if(blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y - 1&& blockUnder.location.z === block.location.z) {
				if(blockUnder.typeId !== "minecraft:air") {
					flag(player, "Scaffold", "D", "Placement", "blockUnder", blockUnder.typeId, false);
				}
			}

			// If the blocks location is below -64 flag
			if(block.location.y < -64) {
				flag(player, "Scaffold", "D", "Placement", "location", block.location.y, false);
			}
		}

		// Scaffold/E = Speed limit check
		if(config.modules.scaffoldE.enabled) {
			if(!player.isFlying && !player.hasTag("op")) {
				if(playerSpeed > config.modules.scaffoldE.speed && !player.hasTag("speed") || playerSpeed > config.modules.scaffoldE.speed - 0.1 && player.hasTag("strict")) {
					flag(player, "Scaffold", "E", "Placement", "speed", playerSpeed, false);
				}
			}
		}

		// Scaffold/F = Place limit check (Amount of blocks placed in a scaffold ish way per 20 ticks)
		if(config.modules.scaffoldF.enabled) {
			const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
			if(distance < 2) {
				const valueOfBlocks = getScore(player, "scaffoldAmount", 0)
				setScore(player, "scaffoldAmount", valueOfBlocks + 1);
			}
		}

		// Tower/A = Checks for 90 degree rotation
		if(config.modules.towerA.enabled) {
			// get block under player
			const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
			if(rotation.x === 90 && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
				flag(player, "Tower", "A", "Placement", "xRot", "90", true);
				if(config.modules.towerA.undoPlace) {
					undoPlace = true;
				}
			}
		}
	}

	// Reach/B = checks for placing blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach")) {
		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
		if(distance > config.modules.reachB.reach && player.fallDistance !== 0) {
			flag(player, "Reach", "B", "Placement", "distance", distance, false);
			undoPlace = true;
		}
		if(distance === 1.25) {
			flag(player, "Scaffold", "E", "Placement", "distance", distance, false);
		}
	}
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
	
	if(brokenBlockId === "minecraft:diamond_ore") {
		player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §b[§cXray§b]§r ${player.nameTag} has found §g1x Diamond Ore."}]}`);
	} else if (brokenBlockId === "minecraft:ancient_debirs") {
		player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §b§c[Xray§b]§r ${player.nameTag} has found §g1x Ancient Debris."}]}`);
	}

	// Reach/B = checks for breaking blocks too far away
	if(config.modules.reachB.enabled && !player.hasTag("noreach")) {
		const distance = Math.sqrt(Math.pow(block.location.x - player.location.x, 2) + Math.pow(block.location.y - player.location.y, 2) + Math.pow(block.location.z - player.location.z, 2));
		if(distance > config.modules.reachB.reach) {
			flag(player, "Reach", "B", "Breaking", "distance", distance, false);
			revertBlock = true;
		}
	}

	if(config.modules.breakerA.enabled) {
    // Check if the block being broken is a bed
		if(block.typeId.includes("minecraft:bed")) {
			// Check the blocks around the player
			let isBreakingThroughBlock = false;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const blockAroundPlayer = dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (blockAroundPlayer.typeId !== "minecraft:air") {
							isBreakingThroughBlock = true;
							break;
						}
					}
					if(isBreakingThroughBlock) break;
				}
				if(isBreakingThroughBlock) break;
			}

			if(isBreakingThroughBlock) {
				// The player is breaking a bed through a block, flag for BedFucker
				flag(player, "Breaker", "A", "Misc", "blocks between bed", "true", false);
				revertBlock = true;
			}
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
	if(brokenBlockId === "minecraft:snow" || brokenBlockId === "minecraft:snow_layer") {
		player.addTag("snow");
	}

	// Autotool/A = checks for player slot mismatch
	if(config.modules.autotoolA.enabled && player.flagAutotoolA) {
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

/*
world.afterEvents.beforeItemUseOn.subscribe((beforeItemUseOn) => {
	const player = beforeItemUseOn.source;
	const item = beforeItemUseOn.itemStack;

	// commandblockexploit/f = cancels the placement of cbe items
	if(config.modules.commandblockexploitF.enabled && config.itemLists.cbe_items.includes(item.typeId)) {
		flag(player, "CommandBlockExploit","F", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
		beforeItemUseOn.cancel = true;
	}

	/*
		illegalitems/e = cancels the placement of illegal items
		illegalitems/a could be bypassed by using a right click autoclicker/autobuild or lag
		thx drib or matrix_code for telling me lol
	
	if(config.modules.illegalitemsE.enabled) {
		// items that are obtainable using commands
		if(!player.hasTag("op")) {
			let flagPlayer = false;

			// patch element blocks
			if(config.itemLists.elements && item.typeId.startsWith("minecraft:element_"))
				flagPlayer = true;
			
			// patch spawn eggs
			if(item.typeId.endsWith("_spawn_egg")) {
				if(config.itemLists.spawnEggs.clearVanillaSpawnEggs && item.typeId.startsWith("minecraft:"))
					flagPlayer = true;

				if(config.itemLists.spawnEggs.clearCustomSpawnEggs && !item.typeId.startsWith("minecraft:"))
					flagPlayer = true;
			}

			if(config.itemLists.items_semi_illegal.includes(item.typeId) || flagPlayer) {
				const checkGmc = world.getPlayers({
					excludeGameModes: [Minecraft.GameMode.creative],
					name: player.name
				});
			
				if([...checkGmc].length !== 0) {
					flag(player, "IllegalItems", "E", "Exploit", "block", item.typeId, undefined, undefined, player.selectedSlot);
					beforeItemUseOn.cancel = true;
				}
			}
		}
	
		// items that cannot be obtained normally
		if(config.itemLists.items_very_illegal.includes(item.typeId)) {
			flag(player, "IllegalItems", "E", "Exploit", "item", item.typeId, undefined, undefined, player.selectedSlot);
			beforeItemUseOn.cancel = true;
		}
	}

	if(player.hasTag("freeze")) beforeItemUseOn.cancel = true;
});
*/
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
	let rotationLogX;
	let rotationLogY;
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
		if (playerFlags.has(player)) {
			// Report the player
			if(player.hasTag("a")) {
				const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
				if(distance > 2) {
					entityHit.cancel;
					flag(player, "Aim", "A", "Combat", "rotation", `${rotation.x},${rotation.y}`, false);
					player.removeTag("a");
				}
			} 
			if(player.hasTag("b")) {
				entityHit.cancel;
				flag(player, "Aim", "B", "Combat", "x", `${rotation.x},y=${rotation.y}`, false);
				player.removeTag("b");
			}

		}
		if(player.hasTag("c")) {
			entityHit.cancel;
			flag(player, "Aim", "C", "Combat", "x", `${rotation.x},y=${rotation.y}`, false);
			player.removeTag("c");
		}

	}

	// ==================================
	//                    Killaura
	// ==================================
	if(config.generalModules.killaura && !player.hasTag("noaura")) {
		// killaura/C = checks for multi-aura
		if(config.modules.killauraC.enabled && !player.entitiesHit.includes(entity.id)) 
			player.entitiesHit.push(entity.id);
			if(player.entitiesHit.length >= config.modules.killauraC.entities) {
				entityHit.cancel;
				flag(player, "KillAura", "C", "Combat", "entitiesHit", player.entitiesHit.length, true);
				player.addTag("strict");
			}


		// Check if the player attacks an entity while looking perfectly down
		if(config.modules.killauraD.enabled && !player.hasTag("sleeping")) {
			const rotation = player.getRotation()
			const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
			if(rotation.x > 79 && distance > 2 || distance > 2 && rotation.x < -79) {
				if(!player.hasTag("trident") && !player.hasTag("bow")) {
					entityHit.cancel;
					flag(player, "Killaura", "D", "Combat", "angle", `${rotation.x},distance=${distance}`, false);
					
				}
			}
		}

		// Hitbox/A = Checks for not having the attacked player on your screen
		// This can cause some issues on laggy servers so im gonna have to try fix that
		if(config.modules.hitboxA.enabled && !player.hasTag("nohitbox")) {
			const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
			if(angleCalc(player, entity) > 95 && distance > 4) {
				flag(player, "Hitbox", "A", "Combat", "angle", "> 90", false);
			}
		}
 
		// Killaura/F = Checks for looking at the center of an entity
		if(config.modules.killauraF.enabled && player.hasTag("strict")) {
			if(angleCalc(player, entity) < 0.99) {
				if(Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2)) > 2.6 && !player.hasTag("strict")) {
					flag(player, "Killaura", "F", "Combat", "angle", angleCalc(player, entity), true);
				}
			}
		}
		
		// Killaura/F is an extremely advanced check that looks at players rotations to try to determine if the player is using any sort of Killaura or Aimbot style cheats
		// The check does its best to find Killaura and not flag for players who just have naturally good Aim
		// Tho that is true, it still has the chance to false flag a player for using killaura even if their not
		if (config.modules.killauraF.enabled && player.hasTag("strict")) {
			const pos1 = player.getHeadLocation();
			const pos2 = entity.getHeadLocation();
			let angle1 = Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * (180 / Math.PI) - player.getRotation().y - 90;
			if (angle1 <= -180) angle1 += 360;
			angle1 = Math.abs(angle1);
			let angle2 = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * (180 / Math.PI) - player.getRotation().x * 2 - 90;
			if (angle2 <= -180) angle2 += 360;
			angle2 = Math.abs(angle2);
			const attackVector2Angle = { x: angle1, y: angle2 };
			
			if (
					lastAttackVector2Angle.get(player) && 
				(
					(Math.abs(lastAttackVector2Angle.get(player).x - attackVector2Angle.x) <= 0.5 &&
					Math.abs(lastAttackVector2Angle.get(player).x - attackVector2Angle.x) !== 0 ||
					Math.abs(lastAttackVector2Angle.get(player).y - attackVector2Angle.y) <= 0.5 &&
					Math.abs(lastAttackVector2Angle.get(player).y - attackVector2Angle.y) !== 0) ||
					(Math.abs(lastAttackVector2Angle.get(player).x) > 1.2 && Math.abs(lastAttackVector2Angle.get(player).x) < 1.5) ||
					(Math.abs(lastAttackVector2Angle.get(player).y) > 1.2 && Math.abs(lastAttackVector2Angle.get(player).y) < 1.5)
				)
				) {
				if (getScore(player, "auraF_buffer", 0) > 5 && hVelocity(player) > 1) {
					flag(player, "Killaura", "F [Beta]", "Combat", "angleDiff(1)", `${Math.abs(lastAttackVector2Angle.get(player).x - attackVector2Angle.x)}, ${Math.abs(lastAttackVector2Angle.get(player).y - attackVector2Angle.y)}`, true);
					setScore(player, "auraF_buffer", 0);
				} else {
					setScore(player, "auraF_buffer", getScore(player, "auraF_buffer", 0) + 1);
				}
			}
			lastAttackVector2Angle.set(player, attackVector2Angle);
		}	  
	}

	
	// reach/A = check if a player hits an entity more then 5.1 blocks away
	if((config.modules.reachA.enabled || config.generalModules.reach) && !player.hasTag("noreach")) {
		// get the difference between 2 three dimensional coordinates
		const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
		//if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${distance}`);
		const entityVelocity = entity.getVelocity();
		if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && (entityVelocity.x + entityVelocity.z) / 2 < 2) {
			const checkGmc = world.getPlayers({
				excludeGameModes: [Minecraft.GameMode.creative],
				name: player.name
			});
		
			if([...checkGmc].length !== 0) {
				entityHit.cancel;
				flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`, false);
			}
		}
	}
	

	// badpackets[3] = checks if a player attacks themselves
	// some (bad) hacks use this to bypass anti-movement cheat checks
	if(config.modules.badpacketsC.enabled && entity.id === player.id) {
		flag(player, "BadPackets", "C", "Exploit");
		entityHit.cancel;
	}
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
	

	if(config.debug && player.hasTag("logHits")) console.warn(player.getTags(), "rotation", rotation.x, "angleDiff", angleCalc(player, entity));
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

	if(config.modules.fastuseA.enabled) {
		const lastThrowTime = Date.now() - player.lastThrow;
		if(lastThrowTime > config.modules.fastuseA.min_use_delay && lastThrowTime < config.modules.fastuseA.max_use_delay) {
			// flag(player, "FastUse", "A", "Combat", "lastThrowTime", lastThrowTime);
			itemUse.cancel = true;
		}
		player.lastThrow = Date.now();
	}

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

