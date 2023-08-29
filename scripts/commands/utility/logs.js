import data from "../../data/data";
import { playerTellraw  } from "../../data/api/api.js";
/**
 * @name logs
 * @param {object} message - Message object
 */
export function logs(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    let logs = data.recentLogs;          
    playerTellraw(player, "------------\nIsolate Logs\n------------")
    for (let i = 0; i < logs.length; i++) {
        playerTellraw(player, logs[i]);
    }
    
}
