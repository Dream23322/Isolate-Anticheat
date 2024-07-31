export function announce(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"§c§lAdmin Announcement\n\n§r${player.nameTag} >> ${message.args.slice(0).join(" ")}"}]}`);
}
