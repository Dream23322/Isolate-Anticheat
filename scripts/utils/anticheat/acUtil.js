import settings from "../../data/settings";
export function joinData(player) {
    if(settings.general.chatRanks) { 
        if(player.name == player.nameTag) {
            player.nameTag =   `[Member] ${player.name}`
        }
    }   
}