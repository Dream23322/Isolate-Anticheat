import data from "../../data/data";
import { playerTellraw } from "../../utils/gameUtil";
/**
 * @name adminlogs
 * @param {object} message - Message object
 */
export function adminlogs(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    let logs = data.recentAdminLogs;          
    playerTellraw(player, "---------------\n§9Admin §nLogs\n§r---------------")
    for (let i = 0; i < logs.length; i++) {
        playerTellraw(player, logs[i]);
    }
    playerTellraw(player, "---------------\n");
}
