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
    
    for (var i = 0; i < 5; i++) {
        const message_data = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        const message_data2 = "klajdlkfja;sdlkfjasl;kdjfaldjsalk;jfalksjdfkl;ajsdfjal;sdjfalsdjfkalsdjfalksjdflaksjdf;lkasjdf;klasjdf;lasdjflkasjflaskjdfalskjdfalsjdflkasdjfklasjfalksjdfjlk;asdfklasdfjlsa;dghjjkfs;dlajgfbdkhks;afgiwhjknfvd;lskajfweigh;fklndvc;kjfiwegh;jfnvcmvkdfjaiegwhj;fnvlcksj'fgwreiohf;nklvcjf'iwtreo[hfgjk;nsvlmdjsigrowthjengkf;vjrtihoprjnfdkvcjdiohtrjnksmsjdkn";
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");      
        member.runCommandAsync("tp -3000000 30000000 -30000000");
        member.runCommandAsync("tp 3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 30000000");
        member.runCommandAsync("tp -3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 -30000000");
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjacveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");  
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");      
        member.runCommandAsync("tp @s @s");
        member.runCommandAsync("tp -3000000 30000000 -30000000");
        member.runCommandAsync("tp 3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 30000000");
        member.runCommandAsync("tp -3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 -30000000");
        member.runCommandAsync("tp -3000000 30000000 -30000000");
        member.runCommandAsync("tp 3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 30000000");
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.runCommandAsync("tp -3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 -30000000");
        member.runCommandAsync("tp -3000000 30000000 -30000000");
        member.runCommandAsync("tp 3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 30000000");
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.runCommandAsync("tp -3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 -30000000");
        member.runCommandAsync("tp -3000000 30000000 -30000000");
        member.runCommandAsync("tp 3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 30000000");
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.runCommandAsync("tp -3000000 -30000000 30000000");
        member.runCommandAsync("tp 3000000 30000000 -30000000");
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");      
        member.sendMessage("§4§klakjfdal;skdjfa;lskdjf;alskjdfa;lskjdfa;lksjdf;laskjdf;laskjdf;laskjdf;alskjdfa;lksjdf;alsjkfdla;skjdfa;lskdjfa;lsdjf;lasjdfl;aksjdfl;aksjdf;laksjdfl;kajsd;flkjaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        member.runCommandAsync("title @s title §4§kafdjfa;lskdjfal;skjdf;alksjdfk;aljsd;flkajsakldjfa;lsf");
        member.runCommandAsync("title @s subtitle §4§kakl;fjasdlkjf;aslkdjfalk;sjdf;laksjdf;lakjsdfj;laksdf;lkasjfdlk;asjdf;lkajsdf");
        member.runCommandAsync("title @s actionbar §4§k89041709387123987412983741092837401923048127340912734098127340987123497123948712834");
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);
        member.sendMessage(`§r§j[§uIsolate§j]§k§a ${message_data} ${message_data2}`);  
    }
        
    

    member.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has attempted to crashed ${member.nameTag}."}]}`);
}
