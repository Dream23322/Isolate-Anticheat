execute @s[tag=!op] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has been §4banned."}]}
tag @s[tag=!op] remove freeze
tag @s[tag=!op] add isBanned
tellraw @s[tag=op] {"rawtext":[{"text":"To ban someone use this command \"/execute as [playername] run function ban\""}]}
