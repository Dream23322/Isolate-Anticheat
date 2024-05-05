import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";
import { capitalizeFirstLetter } from "../../util.js";
const world = Minecraft.world;

// found the inventory viewing scipt in the bedrock addons discord, unsure of the original owner (not my code)
/**
 * @name invsee
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function invsee(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide whos inventory to view.");
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    player.sendMessage(getInvseeMsg(member));
}
export function getInvseeMsg(player) {
	const container = player.getComponent("inventory")?.container;

	let inventory = `§r§j[§uIsolate§j]§r ${player.name}'s inventory:\n\n`;

	// This function loops through every enchantment on the item and then adds it to the inventory string. It is used if show_enchantments is enabled in the config
	const loopEnchants = (allEnchantments = []) => {
		for(const enchantment of allEnchantments) {
			const id = enchantment.type.id;
			const level = enchantment.level;

			const enchantmentName = capitalizeFirstLetter(id);

			inventory += `    | ${enchantmentName} ${level}\n`;
		}
	};

	// Loop through every armor slot
	let foundItem = false;
	if(config.customcommands.invsee.show_armor) {
		const armor = player.getComponent("equippable");

		for(const equipment of Object.keys(equipmentList)) {
			// @ts-expect-error
			const item = armor?.getEquipment(equipment);
			if(!item) continue;

			foundItem = true;

			inventory += `§r§j[§uIsolate§j]§r ${equipmentList[equipment]}: ${item.typeId} x${item.amount}\n`;

			if(config.customcommands.invsee.show_enchantments) {
				loopEnchants(item.getComponent("enchantable")?.getEnchantments());
			}
		}

		if(foundItem) inventory += `\n`;
	}

	// Loop through every item in the player's inventory
	for(let i = 0; i < 36; i++) {
		if(!container) break;

		const item = container.getItem(i);
		if(!item) continue;

		foundItem = true;

		inventory += `§r§j[§uIsolate§j]§r Slot ${i}: ${item.typeId} x${item.amount}\n`;

		if(config.customcommands.invsee.show_enchantments) {
			loopEnchants(item.getComponent("enchantable")?.getEnchantments());
		}
	}

	if(!foundItem) return `§r§j[§uIsolate§j]§r ${player.name}'s inventory is empty.`;

	return inventory.replace(/\n+$/, "");
}