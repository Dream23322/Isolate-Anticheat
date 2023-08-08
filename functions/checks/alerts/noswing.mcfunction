scoreboard players add @s killauravl 1
tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §1has failed §7(Combat) §4Killaura/B (NoSwing) §7(last_attack="},{"score":{"name":"@s","objective":"last_attack"}},{"text":")§4 VL= "},{"score":{"name":"@s","objective":"killauravl"}}]}
scoreboard players set @s last_attack 0