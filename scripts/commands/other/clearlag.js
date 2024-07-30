/**
 * @name clearlag
 * @param {object} message - Message object
 */
export function clearlag(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    const commands = [
        "kill @e[type=item]",
        "kill @e[type=arrow]",
        "kill @e[type=xp_orb]",
        "kill @e[type=tnt]",
        "kill @e[type=wither_skeleton_skull]",
        "kill @e[type=wither_skeleton_skull_dangerous]",
    ]
    for (const command of commands) player.runCommandAsync(command);

    player.sendMessage("§r§j[§uIsolate§j]§r Cleared lag.");
}
