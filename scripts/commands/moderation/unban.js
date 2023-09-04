import data from "../../data/data.js";


/**
 * @name unban
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function unban(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;

    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to unban.");

    const reason = args.slice(1).join(" ").replace(/"|\\/g, "") || "No reason specified";
    
    const member = args[0].replace(/"|\\/g, "");

    if(data.unbanQueue.includes(member)) return player.sendMessage(`§r§j[§uIsolate§j]§r ${member} is already queued for an unban.`);

    data.unbanQueue.push(member.toLowerCase());
    const message = `${member.nameTag} §jwas §punbanned§j by §n${player.nameTag} §j[§n${reason}§j]`;
    
    data.recentLogs.push(message)
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has added ${member} to the unban queue. Reason: ${reason}"}]}`);
}
