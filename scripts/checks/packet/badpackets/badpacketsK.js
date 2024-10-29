import { flag } from "../../../util";
import config from "../../../data/config.js";
/*

BadPackets/K is from Scythe-Anticheat v3.2.0 (meaning the check was added after Isolate was "forked" from scythe)
The check is designed to stop bedrock-protocol bots from crashing your server. This is the most common type of crashing method so I decided to add it to Isolate as fast as possible, not even looking for another way
If you have a bot that uses bedrock-protocol, such as one that links realm chat with discord, you can give that bot isolate op (!op <botname>) and it will stop it from getting banned by this check
Thanks for the check NT AUTHORITY.

Link to scythe anticheat:
https://github.com/Scythe-Anticheat/Scythe-Anticheat/

Commit where the check was added:
3d3372d
*/

export function badpackets_k(player) {
	if(
		config.modules.badpacketsK.enabled &&
		(player.clientSystemInfo.maxRenderDistance < 6 || player.clientSystemInfo.maxRenderDistance > 96)
	) flag(player, "BadPackets", "K", "Exploit", `maxRenderDistance=${player.clientSystemInfo.maxRenderDistance}`);
}