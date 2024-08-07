import * as Minecraft from "@minecraft/server";

export function irc(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to have a message to send");

    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate-IRC§j]§r ${player.nameTag} >> ${args.slice(0).join(" ")}"}]}`);
} 