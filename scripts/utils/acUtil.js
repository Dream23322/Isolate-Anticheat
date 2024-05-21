import config from "../data/config";
export function joinData(player) {
    if(config.modules.settings.chatRanks) { 
        if(player.name == player.nameTag) {
            player.nameTag =   `[Member] ${player.name}`
        }
    }   
}