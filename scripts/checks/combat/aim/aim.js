/*
Aim check manager 

This is needed because the aim checks run in a different event loop than the flag.
*/

export function aimCheckManager(player, entity) {
    if(player.hasTag("a")) {
        const distance = Math.sqrt(Math.pow(entity.location.x - player.location.x, 2) + Math.pow(entity.location.y - player.location.y, 2) + Math.pow(entity.location.z - player.location.z, 2));
        if(distance > 2 && angleCalc(player, entity) < 2) {
            flag(player, "Aim", "A", "Combat", "rotation", `${rotation.x},${rotation.y}`, false);
            player.removeTag("a");
        }
    } 
    if(player.hasTag("b")) {
        flag(player, "Aim", "B", "Combat", "x", `${rotation.x},y=${rotation.y}`, false);
        player.removeTag("b");
    }
    if(player.hasTag("c")) {
        flag(player, "Aim", "C", "Combat", "x", `${rotation.x},y=${rotation.y}`, false);
        player.removeTag("c");
    }
}