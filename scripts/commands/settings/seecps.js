/**
 * @name seecps
 * @param {object} message - Message object
 */
export function seecps(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    player.runCommandAsync("function tools/cps");
}