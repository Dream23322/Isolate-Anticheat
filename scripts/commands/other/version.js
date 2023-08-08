/**
 * @name version
 * @param {object} message - Message object
 */
 export function version(message) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    const player = message.sender;
    
    player.runCommandAsync("function version");
}
