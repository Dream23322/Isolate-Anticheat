import * as Minecraft from "@minecraft/server";
import config from '../../data/config.js';

export function autokick(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
    // @yellowworld777 
// Add stuff here to change the value of that permenantly 
    const player = message.sender;
    if(config.autoKick) {
        return;
    }
}