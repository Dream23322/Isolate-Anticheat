import settings from "../../../data/settings";

export function kickPlayer(player, reason, message) {
    if (settings.general.theme === "1") {
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r A player has been removed from your game for using an §6unfair advantage!"}]}`);
    } else if (settings.general.theme === "2") {
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c\n||===============================||"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u§l Isolate Anticheat"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Player Kicked: §n${player.name}"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§u Reason: ${reason}"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c||===============================||\n"}]}`);
        player.runCommandAsync(`tellraw @a[tag=!notify] {"rawtext":[{"text":"§r§c "}]}`);
    }

    player.runCommandAsync(`kick "${player.name}" ${message}`);
}