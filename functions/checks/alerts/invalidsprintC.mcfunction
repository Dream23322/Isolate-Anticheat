# InvalidSprint/C
scoreboard players add @s invalidsprintvl 1
tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §1has failed §7(Movement) §4InvalidSprint/C. VL= "},{"score":{"name":"@s","objective":"invalidsprintvl"}}]}
tp @s @s
