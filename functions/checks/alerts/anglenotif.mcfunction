tp @s ~~~ facing @s
scoreboard players add @s badpacketsvl 1
tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" §1has failed §7(Exploit) §4BadPackets/A. VL= "},{"score":{"name":"@s","objective":"badpacketsvl"}}]}