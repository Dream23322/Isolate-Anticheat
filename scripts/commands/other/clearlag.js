/**
 * @name clearlag
 * @param {object} message - Message object
 */
export function clearlag(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    player.runCommandAsync("kill @e[type=item]");
    player.runCommandAsync("kill @e[type=arrow]");

    player.sendMessage("§r§j[§uIsolate§j]§r Cleared lag.");
}
