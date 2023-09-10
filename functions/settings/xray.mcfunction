# make sure they are allowed to use this command
tellraw @s[type=player,tag=!op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §4§lHey! §rYou must be Isolate-Opped to use this function."}]}
execute @s[tag=!op] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has tried to toggle anti-xray without op permissions."}]}

# deny
execute @s[type=player,tag=op,scores={xray=..0}] ~~~ scoreboard players set scythe:config xray 1
execute @s[type=player,tag=op,scores={xray=..0}] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has disabled §4Anti-xray."}]}

# allow
execute @s[type=player,tag=op,scores={xray=1..}] ~~~ scoreboard players set scythe:config xray 0
execute @s[type=player,tag=op,scores={xray=1..}] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has enabled §aAnti-xray."}]}

scoreboard players operation @a xray = scythe:config xray
