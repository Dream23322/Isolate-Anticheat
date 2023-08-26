import * as Minecraft from "@minecraft/server";
import config from "../../data/config.js";

const world = Minecraft.world;

/**
 * @name about
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function about(message, args) {
  // validate that required params are defined
  if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);
  if(typeof args !== "object") throw TypeError(`args is type of ${typeof args}. Expected "object".`);

  const player = message.sender;

  // Check if the module exists in the config file
  const moduleName = args[0];
  if (!config.modules[moduleName]) {
    return player.sendMessage("§r§j[§uIsolate§j]§r Couldn't find that module.");
  }

  // Check if the module has a description
  if (!config.modules[moduleName].description) {
    return player.sendMessage("§r§j[§uIsolate§j]§r That module has no description.");
  }

  const description = config.modules[moduleName].description;
  player.sendMessage(`§r§j[§uIsolate§j]§r Description of ${moduleName}: ${description}`);
}

