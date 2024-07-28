
tellraw @s[tag=!seeREACH] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r REACH view has been enabled."}]}
tag @s[tag=!canc,tag=!seeREACH] add canc
tag @s[tag=!seeREACH] add seeREACH


tellraw @s[tag=seeREACH,tag=!canc] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r REACH view has been disabled."}]}
tag @s[tag=seeREACH,tag=!canc] remove seeREACH

tag @s remove canc