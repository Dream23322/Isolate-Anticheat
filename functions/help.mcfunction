# sometimes the gametestapi scoreboard value doesnt apply correctly so we apply it again


tellraw @s {"rawtext":[{"text":"\n§l§uIsolate AntiCheat Command Help"}]}
tellraw @s {"rawtext":[{"text":"\n§l§u------------------------------------"}]}

tellraw @s {"rawtext":[{"text":"\n§l§dModeration Commands"}]}

# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!help§r - Shows this help page."}]}
tellraw @s {"rawtext":[{"text":"§u!ban <username> [time] [reason]§r - Ban the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!kick <username> [reason]§r - Kick the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!mute <username> [reason]§r - Mute the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!unmute <username> [reason]§r - Unmute the specified user."}]}
tellraw @s {"rawtext":[{"text":"§u!notify§r - Enables/Disables cheat notifications."}]}
tellraw @s {"rawtext":[{"text":"§u!credits§r - Shows credits, that's it."}]}
tellraw @s {"rawtext":[{"text":"§u!op <username>§r - Op's a player in Isolate Anticheat features."}]}
tellraw @s {"rawtext":[{"text":"§u!unban <username> [reason]§r - Unbans the specified player."}]}
tellraw @s {"rawtext":[{"text":"§u!kickall §r - Kicks everyone from the server (except op's)."}]}


tellraw @s {"rawtext":[{"text":"\n§l§dOptional Features"}]}

# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!modules§r - View all enabled or disabled modules."}]}
tellraw @s {"rawtext":[{"text":"§u!antiGMA§r - Enables/disables gamemode 2 (Adventure) to be used."}]}
tellraw @s {"rawtext":[{"text":"§u!antiGMC§r - Enables/disables gamemode 1 (Creative) to be used."}]}
tellraw @s {"rawtext":[{"text":"§u!antiGMS§r - Enables/disables gamemode 0 (Survival) to be used."}]}
tellraw @s {"rawtext":[{"text":"§u!autoban§r - Enables/disables auto-banning."}]}
tellraw @s {"rawtext":[{"text":"§u!autoclicker§r - Enables/disables anti-autoclicker."}]}
tellraw @s {"rawtext":[{"text":"§u!bedrockValidate§r - Enables/disables validation of bedrock (Such as in the nether roof or at y=-64)."}]}
tellraw @s {"rawtext":[{"text":"§u!invalidsprint§r - Enables/disables anti-invalidsprint."}]}
tellraw @s {"rawtext":[{"text":"§u!npc§r - Enables/disables killing all NPCs."}]}
tellraw @s {"rawtext":[{"text":"§u!overideCommandBlocksEnabled§r - Forces the commandblocksenabled gamerule to be enabled or disabled at all times."}]}
tellraw @s {"rawtext":[{"text":"§u!removeCommandBlocks§r - Enables/disables clearing nearby command blocks."}]}
tellraw @s {"rawtext":[{"text":"§u!worldborder§r - Enables/disables the world border and its size."}]}
tellraw @s {"rawtext":[{"text":"§u!xray§r - Enables/disables anti-xray."}]}


tellraw @s {"rawtext":[{"text":"\n§l§dTools and Utilites"}]}

# Gametest enabled
tellraw @s {"rawtext":[{"text":"§u!about <module>§r - Gives info on a modules (!about scaffoldA !about killauraF)."}]}
tellraw @s {"rawtext":[{"text":"§u!logs§r - Shows server and Isolate anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!crash <username>§r - Tried to crash a player (If crash failed, it will kick them from the server)."}]}
tellraw @s {"rawtext":[{"text":"§u!ecwipe <username>§r - Clears a player's ender chest."}]}
tellraw @s {"rawtext":[{"text":"§u!fly [username]§r - Enables/disables the ability to fly in survival mode."}]}
tellraw @s {"rawtext":[{"text":"§u!freeze <username>§r - Freeze a player and make it so they can't move."}]}
tellraw @s {"rawtext":[{"text":"§u!stats <username>§r - View a specific players anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!fullreport§r - View everyones anticheat logs."}]}
tellraw @s {"rawtext":[{"text":"§u!vanish§r - Enables/disables vanish (Used for spying on suspects)."}]}
tellraw @s {"rawtext":[{"text":"§u!tag <nametag>§r - Adds tag to username in chat window (use \"reset\" to get rid of it)."}]}
tellraw @s {"rawtext":[{"text":"§u!tag <player> <nametag>§r - Adds tag to username in chat window for specific users (use \"reset\" to get rid of it)."}]}
tellraw @s {"rawtext":[{"text":"§u!report <player> [reason]§r - Report a player."}]}
tellraw @s {"rawtext":[{"text":"§u!ui§r - Opens the Isolate Management UI."}]}
tellraw @s {"rawtext":[{"text":"§u!testaura <player>§r - Entity killaura test on player."}]}
tellraw @s {"rawtext":[{"text":"§u!invsee <player>§r - View another players inventory."}]}
tellraw @s {"rawtext":[{"text":"§u!resetwarns <player>§r - Reset a players violations."}]}
