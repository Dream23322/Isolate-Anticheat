tag @s[tag=flying] add noflying
tag @s[tag=noflying] remove flying
ability @s[tag=noflying] mayfly false
tellraw @s[tag=noflying] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Fly has been disabled."}]}
execute @s[tag=noflying] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has left Fly Mode."}]}

ability @s[tag=!noflying] mayfly true
tag @s[tag=!noflying] add flying
tellraw @s[tag=flying,tag=!noflying] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Fly has been enabled."}]}
execute @s[tag=flying,tag=!noflying] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has entered Fly Mode."}]}

tag @s[tag=noflying] remove noflying
