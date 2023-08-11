tag @s[tag=freeze] add nofreeze
tag @s[tag=nofreeze] remove freeze

effect @s[tag=nofreeze] clear
tellraw @s[tag=nofreeze] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r You are no longer frozen."}]}
inputpermission set @s[tag=nofreeze] movement enabled
event entity @s[tag=nofreeze] scythe:unfreeze
execute @s[tag=nofreeze] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" is no longer frozen."}]}

effect @s[tag=!nofreeze] weakness 694200 255 true
inputpermission set @s[tag=!nofreeze] movement disabled
event entity @s[tag=!nofreeze] scythe:freeze
tag @s[tag=!nofreeze] add freeze
effect @s[tag=!nofreeze] slowness 12345 255 true
execute @s[tag=freeze,tag=!nofreeze] ~~~ tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r "},{"selector":"@s"},{"text":" has been frozen."}]}
title @s[tag=!nofreeze] title §b Bit cold?
title @s[tag=!nofreeze] subtitle §b You have been frozen!
tag @s[tag=nofreeze] remove nofreeze