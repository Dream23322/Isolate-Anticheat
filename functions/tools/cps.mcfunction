
tellraw @s[tag=seeCPS] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been disabled."}]}
tag @s[tag=seeCPS] remove seeCPS

tellraw @s[tag=!seeCPS] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r CPS view has been enabled."}]}
tag @s[tag=!seeCPS] add seeCPS