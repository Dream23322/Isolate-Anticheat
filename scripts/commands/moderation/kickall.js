import * as Minecraft from "@minecraft/server";
import { kickPlayer } from "../../utils/gameUtil";
const world = Minecraft.world;
/**
 * @name kickall
 * @param {object} message - Message object
 */
export function kickall(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    const players = world.getPlayers();
    for (const pl of players) {
        if(!pl.hasTag("op")) kickPlayer(pl, `Kicked by ${player.name} (Mass Kick)`);
    }
}
