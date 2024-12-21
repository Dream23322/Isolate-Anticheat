import settings from "../../data/settings";
export function joinData(player) {
    if(settings.general.chatRanks) { 
        if(player.name === player.nameTag) {
            player.nameTag =   `[Member] ${player.name}`
        }
    }   
}

export const findPlayer = (name) => {
    const searchName = name.toLowerCase().replace(/["\\@]/g, "");
    return world.getPlayers().find(player => 
        player.name.toLowerCase().includes(searchName)
    );
};