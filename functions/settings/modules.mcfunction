# Shows all optional features enabled

# sometimes the settings dont apply correctly so we reapply them
function checks/assets/applySettings

tellraw @s[scores={gma=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMA is currently §4DISABLED"}]}
tellraw @s[scores={gms=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMS is currently §4DISABLED"}]}
tellraw @s[scores={gmc=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMC is currently §4DISABLED"}]}
tellraw @s[scores={gma=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMA is currently §aENABLED"}]}
tellraw @s[scores={gms=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMS is currently §aENABLED"}]}
tellraw @s[scores={gmc=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-GMC is currently §aENABLED"}]}
tellraw @s[scores={commandblocks=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r RemoveCommandBlocks is currently §4DISABLED"}]}
tellraw @s[scores={commandblocks=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r RemoveCommandBlocks is currently §aENABLED"}]}
tellraw @s[scores={cmds=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r OverideCommandBlocksEnabled is currently §4DISABLED"}]}
tellraw @s[scores={cmds=1}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r OverideCommandBlocksEnabled is set to §aENABLED"}]}
tellraw @s[scores={cmds=2..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r OverideCommandBlocksEnabled is set to §4DISABLED"}]}
tellraw @s[scores={npc=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-NPC is set to §aENABLED"}]}
tellraw @s[scores={npc=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Anti-NPC is set to §4DISABLED"}]}
tellraw @s[scores={bedrock=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Bedrock validation is set to §aENABLED"}]}
tellraw @s[scores={bedrock=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Bedrock validation is set to §4DISABLED"}]}
tellraw @s[scores={worldborder=1}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a1k"}]}
tellraw @s[scores={worldborder=2}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a5k"}]}
tellraw @s[scores={worldborder=3}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a10k"}]}
tellraw @s[scores={worldborder=4}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a25k"}]}
tellraw @s[scores={worldborder=5}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a50k"}]}
tellraw @s[scores={worldborder=6..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World border is set to §a100k"}]}
tellraw @s[scores={worldborder=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r World Border is set to §4DISABLED"}]}
tellraw @s[scores={xray=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Xray is currently §aENABLED"}]}
tellraw @s[scores={xray=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Xray is currently §4DISABLED"}]}
tellraw @s[scores={autoclicker=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Autoclicker is currently §aENABLED"}]}
tellraw @s[scores={autoclicker=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Autoclicker is currently §4DISABLED"}]}
tellraw @s[scores={autoban=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Auto-Banning is currently §4DISABLED"}]}
tellraw @s[scores={autoban=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Auto-Banning is currently §aENABLED"}]}
tellraw @s[scores={invalidsprint=..0}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Invalid-Sprint is currently §4DISABLED"}]}
tellraw @s[scores={invalidsprint=1..}] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r Invalid-Sprint is currently §aENABLED"}]}