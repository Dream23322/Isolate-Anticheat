# creative mode check
scoreboard players add @s[tag=!op,m=c,scores={gmc=1..}] gamemodevl 1
execute @s[tag=!op,m=c,scores={gmc=1..}] ~~~ tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §uhas tried to §cchange their gamemode §7(Gamemode_C)§4 . VL= "},{"score":{"name":"@s","objective":"gamemodevl"}}]}
gamemode 2 @s[tag=!op,m=c,scores={gma=..0,gmc=1..}]
gamemode 0 @s[tag=!op,m=c,scores={gms=..0,gmc=1..}]