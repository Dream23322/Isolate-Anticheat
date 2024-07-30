# if the player is already op
tellraw @s[tag=op] {"rawtext":[{"text":"To Isolate-Op someone, please use this command: \"/execute as [playername] run function op\"."}]}

tellraw @s[tag=!op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §7You are now op!"}]}
tellraw @s[tag=!op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §7Make sure to join the Isolate discord (https://discord.gg/YQXUXMHwbM)!"}]}
execute @s[tag=!op] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" is now Isolate-Opped."}]}
tag @s[type=player,tag=!op] add op