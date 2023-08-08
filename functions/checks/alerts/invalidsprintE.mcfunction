scoreboard players add @s[type=player] invalidsprintvl 1
tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §1has failed §7(Movement) §4InvalidSprint/B §7(last_move="},{"score":{"name":"@s","objective":"last_move"}},{"text":")§4 VL= "},{"score":{"name":"@s","objective":"invalidsprintvl"}}]}
tp @s[type=player] @s