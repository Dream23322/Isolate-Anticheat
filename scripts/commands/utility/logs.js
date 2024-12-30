import data from "../../data/data";
import { playerTellraw } from "../../utils/gameUtil";
/**
 * @name logs
 * @param {object} message - Message object
 */
export function logs(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;

    let logs = data.recentLogs;
    // If args is empty, show all logs   
    if (args.length === 0) {      
        playerTellraw(player, "---------------\n§9Isolate §nLogs\n§r---------------")
        for (let i = 0; i < logs.length; i++) {
            playerTellraw(player, logs[i]);
        }
        playerTellraw(player, "---------------\n");
    } else {
        playerTellraw(player, "---------------\n§9Isolate §nLogs\n§r---------------")
        for (let i = 0; i < logs.length; i++) {
            if (logs[i].includes(args[0])) {
                playerTellraw(player, logs[i]);
            }
        }
        playerTellraw(player, "---------------\n");
    }
}
