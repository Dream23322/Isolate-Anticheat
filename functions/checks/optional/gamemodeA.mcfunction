# adventure mode check
scoreboard players add @s[tag=!op,m=a,scores={gma=1..}] gamemodevl 1
execute @s[tag=!op,m=a,scores={gma=1..}] ~~~ tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §nhas tried to §uchange their gamemode §h(Gamemode_A)§9 . VL= "},{"score":{"name":"@s","objective":"gamemodevl"}}]}
gamemode 1 @s[tag=!op,m=a,scores={gmc=..0,gma=1..}]
gamemode 0 @s[tag=!op,m=a,scores={gms=..0,gma=1..}]

# if all gamemodes are disabled, allow adventure mode to be used
execute @s[scores={gma=1..,gms=1..,gmc=1..}] ~~~ tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Since all gamemodes were disabled, adventure mode has been enabled."}]}
execute @s[scores={gma=1..,gms=1..,gmc=1..}] ~~~ scoreboard players set * gma 1
