# sometimes the gametestapi scoreboard value doesnt apply correctly so we apply it again


tellraw @s {"rawtext":[{"text":"\n§l§uIsolate AntiCheat v8.7.1 Command Help"}]}
tellraw @s {"rawtext":[{"text":"\n§l§u--------------------------------------"}]}

tellraw @s {"rawtext":[{"text":"\n§l§dModeration Commands"}]}

# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!help§r - Shows this help page."}]}
tellraw @s {"rawtext":[{"text":"§u!ban <username> [time] [reason]§r - Ban the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!kick <username> [reason]§r - Kick the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!mute <username> [reason]§r - Mute the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!unmute <username> [reason]§r - Unmute the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!op <username>§r - Op's a player in Isolate Anticheat features."}]}
tellraw @s {"rawtext":[{"text":"§u!unban <username> [reason]§r - Unbans the specified player."}]}
tellraw @s {"rawtext":[{"text":"§u!kickall §r - Kicks everyone from the server (except op's)."}]}
tellraw @s {"rawtext":[{"text":"§u!invsee <player>§r - View another players inventory."}]}
tellraw @s {"rawtext":[{"text":"§u!resetwarns <player>§r - Reset a players violations."}]}

tellraw @s {"rawtext":[{"text":"\n§l§dOptional Features"}]}

# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!irc, aka !i or !t§r - Talk to other admins without other players seeing!."}]}
tellraw @s {"rawtext":[{"text":"§u!modules§r - View all enabled or disabled modules."}]}
tellraw @s {"rawtext":[{"text":"§u!module <module> <setting> <newValue>§r - Change a modules settings."}]}
tellraw @s {"rawtext":[{"text":"§u!reset§r - Resets config."}]}
tellraw @s {"rawtext":[{"text":"§u!seecps§r - Shows players CPS."}]}
tellraw @s {"rawtext":[{"text":"§u!notify§r - Enables/Disables cheat notifications."}]}
tellraw @s {"rawtext":[{"text":"\n§l§dTools and Utilites"}]}


# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!banlist§r - Shows a list of banned players on the server."}]}
tellraw @s {"rawtext":[{"text":"§u!about <module>§r - Gives info on a modules (!about scaffoldA !about killauraF)."}]}
tellraw @s {"rawtext":[{"text":"§u!logs§r - Shows server and Isolate anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!crash <username>§r - Tried to crash a player (If crash failed, it will kick them from the server)."}]}
tellraw @s {"rawtext":[{"text":"§u!ecwipe <username>§r - Clears a player's ender chest."}]}
tellraw @s {"rawtext":[{"text":"§u!fly <username>§r - Enables/disables the ability to fly in survival mode."}]}
tellraw @s {"rawtext":[{"text":"§u!freeze <username>§r - Freeze a player and make it so they can't move."}]}
tellraw @s {"rawtext":[{"text":"§u!stats <username>§r - View a specific players anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!fullreport§r - View everyones anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!vanish§r - Enables/disables vanish (Used for spying on suspects)."}]}
tellraw @s {"rawtext":[{"text":"§u!tag <nametag>§r - Adds tag to username in chat window (use \"reset\" to get rid of it)."}]}
tellraw @s {"rawtext":[{"text":"§u!tag <player> <nametag>§r - Adds tag to username in chat window for specific users (use \"reset\" to get rid of it)."}]}
tellraw @s {"rawtext":[{"text":"§u!report <player> [reason]§r - Report a player."}]}
tellraw @s {"rawtext":[{"text":"§u!ui§r - Opens the Isolate Management UI."}]}
tellraw @s {"rawtext":[{"text":"§u!credits§r - Shows credits, that's it."}]}
tellraw @s {"rawtext":[{"text":"§r\n§rTip: Use !t to talk to other admins without other people seeing your message!\nDo !ui to get access to the UI in Isolate"}]}