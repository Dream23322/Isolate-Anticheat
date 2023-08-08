import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

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

    const container = member.getComponent('inventory').container;
  
    if(container.emptySlotsCount === 36) {
        return player.sendMessage(`§r§j[§uIsolate§j]§r ${member.nameTag}'s inventory is empty.`);
    }

    let inventory = `§r§j[§uIsolate§j]§r ${member.nameTag}'s inventory:\n\n`;
    
    for (let i = 0; i < 36; i++) {
        const item = container.getItem(i);
        if(!item) continue;

        inventory += `§r§j[§uIsolate§j]§r Slot ${i}: ${item.typeId} x${item.amount}\n`;

        if(config.customcommands.invsee.show_enchantments) {
            const loopIterator = (iterator) => {
                const iteratorResult = iterator.next();
                if(iteratorResult.done) return;
                const enchantData = iteratorResult.value;

                let enchantmentName = enchantData.type.id;
                enchantmentName = enchantmentName.charAt(0).toUpperCase() + enchantmentName.slice(1);

                inventory += `    | ${enchantmentName} ${enchantData.level}\n`;

                loopIterator(iterator);
            };
            loopIterator(item.getComponent("enchantments").enchantments[Symbol.iterator]());
        }
    }

    player.sendMessage(inventory);
}
