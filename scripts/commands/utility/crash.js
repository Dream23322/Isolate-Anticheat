import * as Minecraft from "@minecraft/server";

const world = Minecraft.world;

/**
 * @name crash
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function crash(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

    const player = message.sender;
    
    if(!args.length) return player.sendMessage("§r§j[§uIsolate§j]§r You need to provide who to crash");
    
    // try to find the player requested
    let member;

    for (const pl of world.getPlayers()) if(pl.name.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
        member = pl;
        break;
    }
    
    if(!member) return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that player.");

    const message_data = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    const message_data2 = "klajdlkfja;sdlkfjasl;kdjfaldjsalk;jfalksjdfkl;ajsdfjal;sdjfalsdjfkalsdjfalksjdflaksjdf;lkasjdf;klasjdf;lasdjflkasjflaskjdfalskjdfalsjdflkasdjfklasjfalksjdfjlk;asdfklasdfjlsa;dghjjkfs;dlajgfbdkhks;afgiwhjknfvd;lskajfweigh;fklndvc;kjfiwegh;jfnvcmvkdfjaiegwhj;fnvlcksj'fgwreiohf;nklvcjf'iwtreo[hfgjk;nsvlmdjsigrowthjengkf;vjrtihoprjnfdkvcjdiohtrjnksmsjdkn";
    member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
    member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
    member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
    member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
    member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has attempted to crashed ${member.nameTag}."}]}`);
}
