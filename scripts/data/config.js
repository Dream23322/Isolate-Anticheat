export default
{
    // This config is made for pvp servers so most of the illegal checks are turned off
    "debug": true,
    // if you have a laggy realm/server or don't want to risk anything turn this off
    "experimental_checks": true,
    "fancy_kick_calculation": {
        "on": true,
        // If you have flags more than these values in each catagory, you will be kicked.
        "movement": 5,
        "combat": 3,
        "block": 0,
        "other": 0
    },
    "flagWhitelist": [],
    // Amount of anticheat kicks a player needs to get before getting perm banned

    "clientSpam": {
        // Change to mute if you want to mute the player who used the horion/zephyr spam message
        "punishment": "mute"
    },
    // Having the silent mode on will stop the anticheat from lagging the flagged player back
    // If you dont really know how to config the anticheat, use this... lol
    "generalModules": {
        "fly": true,
        "speed": true,
        "killaura": true,
        "motion": true,
        "aim": true,
        "sprint": true,
        "packet": true,
        "reach": true,
        "movement": true,
        "scaffold": true
    },

    'ViolationsForKick': 15,
    /*
    By enabling this toggle, you can prevent anybody will scythe op from getting flagged from the anticheat
    Although this may be a useful feature, it can be exploited by hackers to completely disable the anticheat for themselves.
    Enable with caution.
    */
    "disable_flags_from_isolate_op": false,
    "customcommands": {
        "prefix": "!",
        "sendInvalidCommandMsg": false,
        "ban": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["b"]
        },
        "help": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["support","commands","what"]
        },
        "op": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["staff"]
        },
        "deop": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["destaff", "demote", "do"]
        },
        "credits": {
            "enabled": true,
            "requiredTags": []
        },
        "modules": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "reset": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "removecommandblocks": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["removecb","rcb"]
        },
        "ecwipe": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["enderchestwipe", "ecw"]
        },
        "freeze": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "stats": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["info"]
        },
        "fullreport": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["fr"]
        },
        "kick": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["k"]
        },
        "mute": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["m"]
        },
        "unmute": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["um"]
        },
        "fly": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "invsee": {
            "enabled": true,
            "show_enchantments": true,
            "requiredTags": ["op"],
            "aliases": ["inv"]
        },
        "cloneinv": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["invclone", "invc"]
        },
        "notify": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["not","notifications"]
        },
        "tag": {
            "enabled": true,
            // The color of the tag name, inside the brackets
            // Players can still choose their own tag color by adding a color code in the !tag command
            "mainColor": "§c",
            // The color of the tag name, aka the brackets
            "borderColor": "§9",
            // Color of player name. Leave blank for none.
            "playerNameColor": "§r",
            "requiredTags": ["op"],
            "aliases": ["rank"]
        },
        "vanish": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["v"]
        },
        "report": {
            "enabled": true,
            "requiredTags": [],
            "aliases": ["r", "wdr", "ir", "isolate-report", "rep","isr","ir","isolatereport","isolate"]
        },
        "testban": {
            "enabled": true,
            "requiredTags": ["op"],
        },
        "crash": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "kickall": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "unban": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ub"]
        },
        "testaura": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ta"]
        },
        "ui": {
            "enabled": true,
            "ui_item_name": "§r§l§aRight click to Open the UI",
            "ui_item": "minecraft:wooden_axe",
            "requiredTags": ["op"],
            "aliases": ["gui"]
        },
        "resetwarns": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["rw"]
        },
        "version": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ver","about"]
        },
        "about": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["what", "a", "info", "?", "define", "def"]
        },
        "logs": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["log", "data", "recent", "rl", "recentlogs"]
        },
        "module": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["m", "settings", "setting"]
        }
    },
    "modules": {
        //How to config modules
        "examplemoduleA": {
            "enabled": true, // If the modules is going to be running or not
            "description": "The example module", // You can ignore this
            "punishment": "kick", // What punishment the modules gives,
            // "none" = does nothing
            // "kick" = kicks the player temporarily
            // "ban" = ban the player
            "punishmentLength": "7d", // How long a player wil be banned. This only matters when the punishment is set to ban
            "minVlBeforePunishment": 10 // How many times the player has to flag the modules before action is taken on them.
            // If you have any other questions, please ask in the discord server.
        },
        "settings": {
            "autoKick": true,
            "autoBan": true,
            "silent": true,
            "kicksBeforeBan": 7,
            // Wait why is this here?
            "ViolationsBeforeBan": 30,
            "autoReset": true,
            "hiveRegen": false,
            "smartNotify": true,
            "smartOnly": false
        },
        "itemSpawnRateLimit": {
            "enabled": false,
            "entitiesBeforeRateLimit": 45
        },
        /*
        Enabling this module is highly discouraged, as it breaks items names, enchantments, durability
        and item data relating to it.
        These items can contain large nbt data which can cause the world file size to dramatically increase.
        In anarchy enviorments, this module can help greatly to prevent world corruption.
        Your welcome, Carthe.
        */
        "resetItemData": {
            "enabled": false,
            "items": [
                "minecraft:armor_stand",
                "minecraft:barrel",
                "minecraft:blast_furnace",
                "minecraft:brewing_stand",
                "minecraft:campfire",
                "minecraft:soul_campfire",
                "minecraft:cauldron",
                "minecraft:chest",
                "minecraft:trapped_chest",
                "minecraft:dropper",
                "minecraft:flower_pot",
                "minecraft:hopper",
                "minecraft:frame",
                "minecraft:glow_frame",
                "minecraft:jukebox",
                "minecraft:lectern",
                "minecraft:chest_minecart",
                "minecraft:hopper_minecart",
                "minecraft:smoker",
                "minecraft:end_gateway",
                "minecraft:sponge"
            ]
        },
        "filterUnicodeChat": true,
        /*
        // This exploit has been entirely patched out.
        "badpackets2": {
            "enabled": true,
            "minLength": 1,
            "maxlength": 512,
            "punishment": "ban",
            /\*
            PunishmentLength can be either a length ('7d', '2w 1h'), how long the ban should be in milliseconds
            or to just perm ban the user (set value to nothing).
            *\/
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        */
        /*
        Misc Checks - Checks that don't really have a catagory.
        */
        "spammerA": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerB": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerC": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "spammerD": {
            "enabled": true,
            "punishment": "mute",
            "minVlbeforePunishment": 5
        },
        "namespoofA": {
            "enabled": false,
            "minNameLength": 3,
            "maxNameLength": 16,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "namespoofB": {
            "enabled": false,
            "regex": /[^A-Za-z0-9_\-() ]/,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "bedrockValidate": {
            "enabled": false,
            "overworld": true,
            "nether": true
        },
        "autotoolA": {
            "enabled": true,
            "description": "Checks for instant slot change after breaking of a block",
            "startBreakDelay": 90,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        /*
        Packet Checks - Checks for invalid/bad movement, rotations, etc. This also includes exploits.
        */
        "exploitA": {
            "enabled": true,
            "description": "Checks for invalid skins",
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "exploitB": {
            "enabled": true,
            "description": "Checks for being below world",
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        // This exploit has been entirely patched out.
        "crasherA": {
            "enabled": false,
            "description":"Checks for old horion crasher method, some clients may still use them",
            "punishment": "ban",
            "punishmentLength": "14d",
            "minVlbeforePunishment": 1
        },
        "badpacketsB": {
            "enabled": true,
            "description": "Checks for moving to far in a tick",
            "speed": 7.3,
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1
        },
        "badpacketsG": {
            "enabled": true,
            "description": "Checks for invalid actions",
            "punishment": "kick",
            "minVlbeforePunishment": 15
        },
        "badpacketsE": {
            "enabled": true,
            "description": "Checks for high amount of packets",
            "min_packets": 30,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        // This exploit has been entirely patched out.
        "badpacketsC": {
            "enabled": true,
            "description":"Checks for self-hit",
            "punishment": "kick",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        "badpacketsF": {
            "enabled": true,
            "description": "Checks if a players rotation is flat",
            "punishment": "kick",
            "minVlbeforePunishment": 15
        },
        "badpacketsH": {
            "enabled": true,
            "description": "Checks for flying without permissions",
            "punishment": "kick",
            "minVlbeforePunishment": 50
        },
        "badpacketsI": {
            "enabled": true,
            "description": "Checks for head rotation over 90 ",
            "angle": 89.999999999999999999999999999,
            "punishment": "kick",
            "minVlbeforePunishment": 200
        },
        "badpacketsJ": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "badpacketsD": {
            "enabled": true,
            "description": "Checks for derp hacks",
            "punishment": "kick",
            "minVlbeforePunishment": 30
        },
        "timerA": {
            "enabled": true,
            "description": "Checks for Timer",
            "timer_level": 27,
            "timer_level_low": 15,
            "strict": false,
            "safe": {
                "swimming": false,
                "placing": true
            },
            // mode: "average" or "all"
            "mode": "average",
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },

        /*
        Combat Checks - Checks that look for pvp cheats (reach, killaura, etc)
        */


        "reachA": {
            "enabled": true,
            "description": "Checks for invalid reach",
            "reach": 6.2,
            "dynamicReach": true,
            "smartReach": true,
            "buffer": 7,
            "dynamicData": {
                "water": 3.5,
                "still": 3.5,
                "speed": 5.4
            },
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "kick",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 30
        },
        "aimA": {
            "enabled": true,
            "description":"Checks for Aim",
            "buffer": 15,
            "punishment": "kick",
            "minVlbeforePunishment": 20
        },
        "aimB": {
            "enabled": true,
            "description":"Checks for Aim",
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "autoclickerA": {
            "enabled": true,
            "maxCPS": 19.5,
            "description":"Checks for CPS over config amount",
            "checkCPSAfter": 1000,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "autoclickerB": {
            "enabled": false,
            "minCPS": 12,
            "maxDeviation": 0.3,
            "punishment": "none",
            "minVlbeforePunishment": 0,
            "checkCPSAfter": 1000
        },
		"killauraA": {
            "enabled": true,
            "description": "Checks for funny killaura rotations (Detects Prax Killaura very fast)",
            "punishment": "kick",
            "minVlbeforePunishment": 3
		},
		"killauraB": {
			"enabled": true,
            "description": "Checks for no-swing (Detects toolbox killaura instantly)",
			"wait_ticks": 20,
			"max_swing_delay": 2000,
			"punishment": "kick",
			"minVlbeforePunishment": 2
		},        
        "killauraC": {
            "enabled": true,
            "description": "Checks for hitting multiple entities at once",
            "entities": 2,
            "punishment": "kick",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 5
        },
        "killauraD": {
            "enabled": true,
            "description": "Checks for looking down when attacking something out of range",
            "punishment": "kick",
            "punishmentLength": "3d",
            "minVlbeforePunishment": 3
        },
        "killauraE": {
			"enabled": true,
            "description": "Checks for hitting entities while using an item",
			"rightTicks": 3,
			"punishment": "kick",
			"minVlbeforePunishment": 5
        },
        "killauraF": {
            "enabled": true,
            "description": "Checks for looking at the exact center of a player",
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },
        "hitboxA": {
            "enabled": true,
            "description": "Checks for hitting a player off screen",
            "buffer": 5,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },

        /*
        Movement Checks - Checks for cheats that modify a players movement. (fly, speed, etc)
        */
        "noslowA": {
            "enabled": true,
            "description": "Checks for going to fast while using an item, false flags with tridents",
            "speed": 0.22,
            "maxSpeed": 0.36,
            "punishment": "kick",
            "minVlbeforePunishment": 40
        },
        "noslowB": {
            "enabled": true,
            "description": "Checks for moving to fast while in cobwebs",
            "speed": 0.22,
            "maxSpeed": 0.36,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "invalidsprintA": {
            "enabled": true,
            "description": "Checks for sprinting with blindness",
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "speedA": {
            "enabled": true,
            "description":"Checks for un-natural speeds (Velocity based)",
            "speed": 2.963,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },     
        "speedB": {
            "enabled": true,
            "description": "Checks for known B-Hop velocities",
            "speed": 2.45,
            "velocity": 0.412,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },  
        "speedC": {
            "enabled": true,
            "desciprtion": "Checks for un-natural speeds (Distance based)",
            "velocity": 0.412,
            "max_bps_h": 8,
            "max_bps_v": 36.2,
            "punishment": "kick",
            "minVlbeforePunishment":3
        },
        "flyA": {
            "enabled": true,
            "description": "In air velocity check",
            "punishment": "kick", 
            "diff": 0.1,
            "speed": 2.45,
            "punishmentLength": "3d",
            "minVlbeforePunishment": 10
        },    
        "flyB": {
            "enabled": true,
            "description": "Checks for a player not going into the predicted location (y)",
            "punishment": "kick",
            "punishmentLength": "5m",
            "minVlbeforePunishment": 30
        },
        "flyC": {
            "enabled": true,
            "description": "Checks for groundspoof (BETA - ONLY PUNISH IF NO TP BLOCKS IN WORLD)",
            "punishment": "none",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 50
        }, 
        "motionA": {
            "enabled": true,
            "speed": 11.5,
            "description": "Checks for really high speed",
            "punishment": "ban",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1
        },
        "motionB": {
            "enabled": true,
            "description": "Checks for really high Y velocity",
            "height": -1.11,
            "punishment": "kick",
            "minVlbeforePunishment": 100
        },
        "motionC": {
            "enabled": true,
            "description": "Checks for not moving when having velocity",
            "min_velocity": 2.5,
            "punishment": "kick",
            "minVlbeforePunishment": 15
        },
        "motionD": {
            "enabled": true,
            "description": "Checks for invalid velocity",
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "predictionA": {
            "enabled": true,
            "description": "Checks for failing BDS Prediction (strafe)",
            "pos_diff": 0.09,
            "time_int": 0.5,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },



        /*
        World Checks - Checks for breaking and placing blocks.
        */
        "nukerA": {
            "enabled": true,
            "description":"Checks for breaking too many blocks in a tick",
            "maxBlocks": 3,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "nukerB": {
            "enabled": true,
            "description":"Checks for breaking a bed that is behind you",
            "angle": 90,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "nukerC": {
            "enabled": true,
            "description":"Checks for breaking a bed that is surrounded by blocks",
            "punishment": "kick",
            "score": -1,
            "minVlbeforePunishment": 1
        },
        "nukerD": {
            "enabled": true,
            "description":"Checks for regen cheats (Hive style)",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },
        "scaffoldA": {
            "enabled": true,
            "nofalse": false,
            "description": "Checks for scaffold rotation (mainly while diag scaffolding)",
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },
        "scaffoldB": {
            "enabled": true,
            "description": "Checks for 60 degree angle, which is a bypass on horion",
            "punishment": "kick",
            "punishmentLength": "30m",
            "minVlbeforePunishment": 3
        },
        "scaffoldC": {
            "enabled": true,
            "description": "Checks for not placing what your holding",
            "punishment": "kick", 
            "buffer": 18,
            "reset": 2,
            "minVlbeforePunishment": 5
        },
        "scaffoldD": {
            "enabled": true,
            "description":"Checks for a pattern in place distance that prax client can use",
            "punishment": "kick",
            "minVlbeforePunishment": 20
        },
        "scaffoldE": {
            "enabled": true,
            "description": "Checks for going too fast while placing",
            "speed": 2.82,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "scaffoldF": {
            "enabled": true,
            "description":"Checks for placing too many blocks in 20 ticks",
            "blocksPerSecond": 7,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "instabreakA": {
            "enabled": true,
            "description": "Checks for breaking unbreakable blocks",
            "unbreakable_blocks": [
                "minecraft:bedrock",
                "minecraft:end_portal",
                "minecraft:end_portal_gateway",
                "minecraft:barrier",
                "minecraft:command_block",
                "minecraft:chain_command_block",
                "minecraft:repeating_command_block",
                "minecraft:end_gateway",
                "minecraft:light_block"
            ],
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "towerA": {
            "enabled": true,
            "description": "Checks for towering up with a x rotation of 90",
            "undoPlace": false,
            "punishment": "kick",
            "minVlbeforePunishment": 15
        },
        "towerB": {
            "enabled": true,
            "max_y_pos_diff": 0.35,
            "description": "Checks for funny velocity while towering up",
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "reachB": {
            "enabled": false,
            "description": "Checks for placing or breaking to far away",
            "reach": 7.55,
            "punishment": "kick",
            "minVlbeforePunishment": 2
        },




        "commandblockexploitG": {
            "enabled": true,
            "npc": true,
            "entities": [
                "minecraft:command_block_minecart",
                "minecraft:agent",
                "minecraft:balloon",
                "minecraft:ice_bomb",
                "minecraft:tripod_camera"
            ],
            // Checks if a certain type of block is near where the entity summoned
            // This helps against more advanced bypasses
            "blockSummonCheck": [
                "minecraft:beehive",
                "minecraft:bee_nest",
                "minecraft:dispenser"
            ],
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },

        "commandblockexploitH": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        }




    },
    "misc_modules": {
        "lag_machine": {
            "antiArmorStandCluster": {
                "enabled": true,
                "radius": 10,
                "max_armor_stand_count": 10
            },
            "antiMinecartCluster": {
                "enabled": true,
                "radius": 30,
                "max_count": 10
            }
        }    
    },
    "itemLists": {
        "spawnEggs": {
            "clearVanillaSpawnEggs": true,
            "clearCustomSpawnEggs": false
        },
        "elements": true,
        "cbe_items": [
            "minecraft:beehive",
            "minecraft:bee_nest",
            "minecraft:moving_block",
            "minecraft:axolotl_bucket",
            "minecraft:cod_bucket",
            "minecraft:powder_snow_bucket",
            "minecraft:pufferfish_bucket",
            "minecraft:salmon_bucket",
            "minecraft:tropical_fish_bucket",
            "minecraft:tadpole_bucket",
            "minecraft:dispenser"
        ],
        "items_semi_illegal": [
            "minecraft:bedrock",
            "minecraft:end_portal_frame",
            "minecraft:dragon_egg",
            "minecraft:monster_egg",
            "minecraft:infested_deepslate",
            "minecraft:mob_spawner",
            "minecraft:budding_amethyst",
            "minecraft:command_block",
            "minecraft:repeating_command_block",
            "minecraft:chain_command_block",
            "minecraft:barrier",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:jigsaw",
            "minecraft:allow",
            "minecraft:deny",
            "minecraft:light_block",
            "minecraft:border_block",
            "minecraft:chemistry_table",
            "minecraft:frosted_ice",
            "minecraft:npc_spawn_egg",
            "minecraft:reinforced_deepslate",
            "minecraft:farmland"
        ],
        "items_very_illegal": [
            "minecraft:flowing_water",
            "minecraft:water",
            "minecraft:flowing_lava",
            "minecraft:lava",
            "minecraft:fire",
            "minecraft:lit_furnace",
            "minecraft:standing_sign",
            "minecraft:wall_sign",
            "minecraft:lit_redstone_ore",
            "minecraft:unlit_redstone_ore",
            "minecraft:portal",
            "minecraft:unpowered_repeater",
            "minecraft:powered_repeater",
            "minecraft:pumpkin_stem",
            "minecraft:melon_stem",
            "minecraft:end_portal",
            "minecraft:lit_redstone_lamp",
            "minecraft:carrots",
            "minecraft:potatoes",
            "minecraft:unpowered_comparator",
            "minecraft:powered_comparator",
            "minecraft:double_wooden_slab",
            "minecraft:standing_banner",
            "minecraft:wall_banner",
            "minecraft:daylight_detector_inverted",
            "minecraft:chemical_heat",
            "minecraft:underwater_torch",
            "minecraft:end_gateway",
            "minecraft:stonecutter",
            "minecraft:glowingobsidian",
            "minecraft:netherreactor",
            "minecraft:bubble_column",
            "minecraft:bamboo_sapling",
            "minecraft:spruce_standing_sign",
            "minecraft:spruce_wall_sign",
            "minecraft:birch_standing_sign",
            "minecraft:birch_wall_sign",
            "minecraft:jungle_standing_sign",
            "minecraft:jungle_wall_sign",
            "minecraft:acacia_standing_sign",
            "minecraft:acacia_wall_sign",
            "minecraft:darkoak_standing_sign",
            "minecraft:darkoak_wall_sign",
            "minecraft:lit_smoker",
            "minecraft:lava_cauldron",
            "minecraft:soul_fire",
            "minecraft:crimson_standing_sign",
            "minecraft:crimson_wall_sign",
            "minecraft:warped_standing_sign",
            "minecraft:warped_wall_sign",
            "minecraft:blackstone_double_slab",
            "minecraft:polished_blackstone_brick_double_slab",
            "minecraft:polished_blackstone_double_slab",
            "minecraft:unknown",
            "minecraft:camera",
            "minecraft:reserved6",
            "minecraft:info_update",
            "minecraft:info_update2",
            "minecraft:lit_deepslate_redstone_ore",
            "minecraft:hard_stained_glass_pane",
            "minecraft:hard_stained_glass",
            "minecraft:colored_torch_rg",
            "minecraft:colored_torch_bp",
            "minecraft:balloon",
            "minecraft:ice_bomb",
            "minecraft:medicine",
            "minecraft:sparkler",
            "minecraft:glow_stick",
            "minecraft:compound",
            "minecraft:powder_snow",
            "minecraft:lit_blast_furnace",
            "minecraft:redstone_wire",
            "minecraft:crimson_double_slab",
            "minecraft:warped_double_slab",
            "minecraft:cobbled_deepslate_double_slab",
            "minecraft:polished_deepslate_double_slab",
            "minecraft:deepslate_tile_double_slab",
            "minecraft:deepslate_brick_double_slab",
            "minecraft:agent_spawn_egg",
            "minecraft:client_request_placeholder_block",
            "minecraft:rapid_fertilizer",
            "minecraft:hard_glass",
            "minecraft:hard_glass_pane",
            "minecraft:exposed_double_cut_copper_slab",
            "minecraft:oxidized_double_cut_copper_slab",
            "minecraft:waxed_double_cut_copper_slab",
            "minecraft:waxed_exposed_double_cut_copper_slab",
            "minecraft:waxed_oxidized_double_cut_copper_slab",
            "minecraft:waxed_weathered_double_cut_copper_slab",
            "minecraft:weathered_double_cut_copper_slab",
            "minecraft:double_wooden_slab",
            "minecraft:double_cut_copper_slab",
            "minecraft:invisible_bedrock",
            "minecraft:piston_arm_collision",
            "minecraft:sticky_piston_arm_collision",
            "minecraft:trip_wire",
            "minecraft:brewingstandblock",
            "minecraft:real_double_stone_slab",
            "minecraft:item.acacia_door",
            "minecraft:item.bed",
            "minecraft:item.beetroot",
            "minecraft:item.birch_door",
            "minecraft:item.cake",
            "minecraft:item.camera",
            "minecraft:item.campfire",
            "minecraft:item.cauldron",
            "minecraft:item.chain",
            "minecraft:item.crimson_door",
            "minecraft:item.dark_oak_door",
            "minecraft:item.flower_pot",
            "minecraft:item.frame",
            "minecraft:item.glow_frame",
            "minecraft:item.hopper",
            "minecraft:item.iron_door",
            "minecraft:item.jungle_door",
            "minecraft:item.kelp",
            "minecraft:item.nether_sprouts",
            "minecraft:item.nether_wart",
            "minecraft:item.reeds",
            "minecraft:item.skull",
            "minecraft:item.soul_campfire",
            "minecraft:item.spruce_door",
            "minecraft:item.warped_door",
            "minecraft:item.wheat",
            "minecraft:item.wooden_door",
            "minecraft:real_double_stone_slab3",
            "minecraft:real_double_stone_slab4",
            "minecraft:cave_vines",
            "minecraft:cave_vines_body_with_berries",
            "minecraft:cave_vines_head_with_berries",
            "minecraft:real_double_stone_slab2",
            "minecraft:spawn_egg",
            "minecraft:coral_fan_hang",
            "minecraft:coral_fan_hang2",
            "minecraft:coral_fan_hang3",
            "minecraft:cocoa",
            "minecraft:mangrove_standing_sign",
            "minecraft:item.mangrove_door",
            "minecraft:mangrove_wall_sign",
            "minecraft:mud_brick_double_slab",
            "minecraft:mangrove_double_slab",
            "minecraft:item.brewing_stand",
            "minecraft:double_stone_block_slab",
            "minecraft:bleach",
            "minecraft:double_stone_block_slab2",
            "minecraft:double_stone_block_slab3",
            "minecraft:double_stone_block_slab4",
            "minecraft:black_candle_cake",
            "minecraft:blue_candle_cake",
            "minecraft:brown_candle_cake",
            "minecraft:candle_cake",
            "minecraft:cyan_candle_cake",
            "minecraft:gray_candle_cake",
            "minecraft:green_candle_cake",
            "minecraft:light_blue_candle_cake",
            "minecraft:light_gray_candle_cake",
            "minecraft:lime_candle_cake",
            "minecraft:magenta_candle_cake",
            "minecraft:orange_candle_cake",
            "minecraft:pink_candle_cake",
            "minecraft:purple_candle_cake",
            "minecraft:red_candle_cake",
            "minecraft:sweet_berry_bush",
            "minecraft:unlit_redstone_torch",
            "minecraft:white_candle_cake",
            "minecraft:yellow_candle_cake"
        ]
    }
};
