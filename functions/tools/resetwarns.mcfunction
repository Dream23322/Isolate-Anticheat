execute @s[type=player,tag=!op] ~~~ tellraw @a[tag=notify] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":"'s warns has been reset."}]}
tellraw @s[tag=op] {"rawtext":[{"text":"To reset someone's warns please use this command \"/execute as [playername] run function tools/resetwarns\""}]}

execute @s[type=!player] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r §cA non player entity has tried to use the resetwarns command. §7("},{"selector":"@s"},{"text":")"}]}

scoreboard players set @s[type=player,scores={autoclickervl=1..}] autoclickervl 0
scoreboard players set @s[type=player,scores={autoshieldvl=1..}] autoshieldvl 0
scoreboard players set @s[type=player,scores={autototemvl=1..}] autototemvl 0
scoreboard players set @s[type=player,scores={badenchants=1..}] badenchants 0
scoreboard players set @s[type=player,scores={badpacketsvl=1..}] badpacketsvl 0
# scoreboard players set @s[type=player,scores={cbevl=1..}] cbevl 0
scoreboard players set @s[type=player,scores={crashervl=1..}] crashervl 0
scoreboard players set @s[type=player,scores={fastusevl=1..}] fastusevl 0
scoreboard players set @s[type=player,scores={flyvl=1..}] flyvl 0
scoreboard players set @s[type=player,scores={illegalitemsvl=1..}] illegalitemsvl 0
scoreboard players set @s[type=player,scores={invalidsprintvl=1..}] invalidsprintvl 0
scoreboard players set @s[type=player,scores={invmovevl=1..}] invmovevl 0
scoreboard players set @s[type=player,scores={killauravl=1..}] killauravl 0
scoreboard players set @s[type=player,scores={namespoofvl=1..}] namespoofvl 0
scoreboard players set @s[type=player,scores={noslowvl=1..}] noslowvl 0
scoreboard players set @s[type=player,scores={nukervl=1..}] nukervl 0
scoreboard players set @s[type=player,scores={reachvl=1..}] reachvl 0
scoreboard players set @s[type=player,scores={spammervl=1..}] spammervl 0
scoreboard players set @s[type=player,scores={towervl=1..}] towervl 0
scoreboard players set @s[type=player,scores={gamemodevl=1..}] gamemodevl 0
scoreboard players set @s[type=player,scores={speedvl=1..}] speedvl 0
scoreboard players set @s[type=player,scores={motionvl=1..}] motionvl 0
scoreboard players set @s[type=player,scores={scaffoldvl=1..}] scaffoldvl 0
scoreboard players set @s[type=player,scores={aimvl=1..}] aimvl 0