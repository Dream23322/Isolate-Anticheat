
tellraw @s[tag=!seeCPS] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been enabled."}]}
tag @s[tag=!canc,tag=!seeCPS] add canc
tag @s[tag=!seeCPS] add seeCPS


tellraw @s[tag=seeCPS,tag=!canc] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been disabled."}]}
tag @s[tag=seeCPS,tag=!canc] remove seeCPS

tag @s remove canc