
tellraw @s[tag=!seeCPS] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been enabled."}]}
tag @s[tag=!seeCPS] add seeCPS
tag @s[tag=!canc] add canc

tellraw @s[tag=seeCPS,tag=!canc] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been disabled."}]}
tag @s[tag=seeCPS,tag=!canc] remove seeCPS

tag @s remove canc