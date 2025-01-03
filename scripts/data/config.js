export default
{
    // This config is made for pvp servers so most of the illegal checks are turned off
    "configID": "a1",
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
    "clientSpam": {
        // Change to mute if you want to mute the player who used the horion/zephyr spam message
        "punishment": "mute"
    },
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
    By enabling this toggle, you can prevent anybody will isolate op from getting flagged from the anticheat
    Although this may be a useful feature, it can be exploited by hackers to completely disable the anticheat for themselves.
    Enable with caution.
    */
    "disable_flags_from_isolate_op": false,
    "customcommands": {
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
        },
        "irc": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["i", "t"]
        },
        "seecps": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["cps"]
        },
        "banlist": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["bl"]
        },
        "oban": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ob"]
        },
        "adminlogs": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["al", "adminlog"]
        },
        "clearlag": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["cl", "lag", "lagclear"]
        },
        "seereach": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["sr", "sreach"]
        },
        "announce": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["a", "ann", "adminannounce"]
        },
        "configid": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": []
        },
        "testmath": {
            "enabled": true,
            "requiredTags": ["op"]
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
            "minVlBeforePunishment": 10, // How many times the player has to flag the modules before action is taken on them.
            "AP": 1 // (Allowed Platforms) What platforms the check works on, 1 = Desktop + 2 = Console + 3 = Mobile (3 will check all, 2 will check desktop and console, 1 will check desktop)
            // If you have any other questions, please ask in the discord server.
        },
        "filterUnicodeChat": false,
        /*
        Misc Checks - Checks that don't really have a catagory.
        */
        "spammerA": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "spammerB": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "spammerC": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "spammerD": {
            "enabled": false,
            "punishment": "mute",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "namespoofA": {
            "enabled": false,
            "minNameLength": 3,
            "maxNameLength": 16,
            "punishment": "kick",
            "minVlbeforePunishment": 1,
            "AP": 3
        },
        "namespoofB": {
            "enabled": false,
            "regex": /[^A-Za-z0-9_\-() ]/,
            "punishment": "kick",
            "minVlbeforePunishment": 1,
            "AP": 3
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
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        /*
        Packet Checks - Checks for invalid/bad movement, rotations, etc. This also includes exploits.
        */
        "exploitA": {
            "enabled": true,
            "description": "Checks for invalid skins",
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 1
        },
        "exploitB": {
            "enabled": true,
            "description": "Checks for being below world",
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        // This exploit has been entirely patched out.
        "crasherA": {
            "enabled": false,
            "description":"Checks for old horion crasher method, some clients may still use them",
            "punishment": "ban",
            "punishmentLength": "14d",
            "minVlbeforePunishment": 1,
            "AP": 3
        },
        "badpacketsB": {
            "enabled": true,
            "description": "Checks for moving to far in a tick",
            "speed": 7.3,
            "punishment": "kick",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 1,
            "AP": 2
        },
        "badpacketsG": {
            "enabled": true,
            "description": "Checks for invalid actions",
            "punishment": "kick",
            "minVlbeforePunishment": 15,
            "AP": 2
        },
        "badpacketsE": {
            "enabled": true,
            "description": "Checks for high amount of packets",
            "min_packets": 30,
            "punishment": "kick",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        // This exploit has been entirely patched out.
        "badpacketsC": {
            "enabled": true,
            "description":"Checks for self-hit",
            "punishment": "kick",
            "punishmentLength": "",
            "minVlbeforePunishment": 1,
            "AP": 3
        },
        "badpacketsF": {
            "enabled": false,
            "description": "Checks if a players rotation is flat",
            "punishment": "kick",
            "minVlbeforePunishment": 50,
            "AP": 1
        },
        "badpacketsH": {
            "enabled": true,
            "description": "Checks for flying without permissions",
            "punishment": "kick",
            "minVlbeforePunishment": 50,
            "AP": 3
        },
        "badpacketsI": {
            "enabled": true,
            "description": "Checks for head rotation over 90 ",
            "angle": 89.999999999999999999999999999,
            "punishment": "kick",
            "minVlbeforePunishment": 200,
            "AP": 3
        },
        "badpacketsJ": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10,
            "AP": 3
        },
        "badpacketsK": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "timerA": {
            "enabled": false,
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
            "minVlbeforePunishment": 10,
            "AP": 2
        },

        /*
        Combat Checks - Checks that look for pvp cheats (reach, killaura, etc)
        */


        "reachA": {
            "enabled": true,
            "description": "Checks for invalid reach",
            "reach": 4.25,
            "predictionTicks": 5,
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "kick",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 30,
            "AP": 3
        },
        "reachB": {
            "enabled": true,
            "description": "Reach check based on reach over time",
            "reach": 5.9,
            "dynamicReach": true,
            "smartReach": true,
            "dynamicData": {
                "water": 3.5,
                "still": 3.5,
                "speed": 1.2
            },
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "kick",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "aimA": {
            "enabled": true,
            "description":"Simple delta check",
            "buffer": 8,
            "diff": 0.05,
            "needHit": true,
            "punishment": "none",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        "aimB": {
            "enabled": true,
            "description":"Checks for invalid rotations",
            "needHit": false,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 1
        },
        "aimC": {
            "enabled": false,
            "description": "Checks for pitch being to active",
            "buffer": 10,
            "small": 1.5,
            "big": 50,
            "needHit": false,
            "punishment": "none",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        "aimD": {
            "enabled": true,
            "buffer": 8,
            "needHit": true,
            "description": "Checks for perfect rotation",
            "punishment": "none",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        "aimE": {
            "enabled": true,
            "description": "Aim kurtosis check",
            "needHit": true,
            "total": 30,
            "duplicates": 35,
            "dataSize": 50,
            "experimental": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        "aimF": {
            "enabled": true,
            "description": "Checks for a valid sensitivty in the rotation",
            "buffer": 10,
            "total": 30,
            "needHit": true,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 1
        },
        "aimG": {
            "enabled": true,
            "description": "Checks for inconsistent aiming",
            "needHit": true,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 1
        },
        "aimH": {
            "enabled": true,
            "description": "Checks for low standard deviation in Pitch and Yaw",
            "needHit": true,
            "minAvg": 2.5,
            "maxStDev": 2,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 1
        },
        "aimI": {
            "enabled": true,
            "description": "Checks for low difference in Pitch ",
            "needHit": true,
            "minAvg": 2.5,
            "maxDiff": 0.1,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 1      
        },
        "autoclickerA": {
            "enabled": true,
            "maxCPS": 19.5,
            "description":"Checks for CPS over config amount",
            "checkCPSAfter": 1000,
            "punishment": "none",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "autoclickerB": {
            "enabled": true,
            "description":"Checks for low deviation in CPS",
            "minCPS": 12,
            "maxDeviation": 0.2500,
            "punishment": "kick",
            "minVlbeforePunishment": 4,
            "checkCPSAfter": 1000,
            "AP": 3
        },
        "autoclickerC": {
            "enabled": true,
            "description":"Checks for rounded CPS",
            "minCPS": 6,
            "buffer": 5,
            "experimental": false,
            "punishment": "kick",
            "minVlbeforePunishment": 3,
            "checkCPSAfter": 1000,
            "AP": 3
        },
        "autoclickerD": {
            "enabled": true,
            "description":"Checks for spikes in CPS",
            "minCPS": 8,
            "spikeAmount": 1.5,
            "buffer": 5,
            "punishment": "none",
            "minVlbeforePunishment": 10,
            "checkCPSAfter": 1000,
            "AP": 1
        },
        "autoclickerE": {
            "enabled": true,
            "description":"Checks for kurtosis in CPS",
            "minCPS": 8,
            "buffer": 20,
            "punishment": "none",
            "minVlbeforePunishment": 5,
            "checkCPSAfter": 1000,
            "AP": 1
        },
		"killauraA": {
            "enabled": true,
            "description": "Checks for funny killaura rotations (Detects Prax Killaura very fast)",
            "punishment": "ban",
            "punishmentLength": "7d",
            "minVlbeforePunishment": 3,
            "AP": 3
		},
		"killauraB": {
			"enabled": true,
            "description": "Checks for no-swing (Detects toolbox killaura instantly)",
			"wait_ticks": 20,
			"max_swing_delay": 2000,
            "rightTicks": 3,
			"punishment": "kick",
			"minVlbeforePunishment": 2,
            "AP": 3
		},        
        "killauraC": {
            "enabled": true,
            "description": "Checks for hitting multiple entities at once",
            "entities": 3,
            "punishment": "kick",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 5,
            "AP": 2
        },
        "killauraD": {
            "enabled": false,
            "description": "Checks for high pitch changes (high false rate)",
            "punishment": "kick",
            "hits": 9,
            "punishmentLength": "3d",
            "minVlbeforePunishment": 100,
            "AP": 1
        },
        "killauraE": {
			"enabled": true,
            "description": "Checks for proper sprint mechanics (Disabled)",
            "minSprint": 5,
			"punishment": "kick",
			"minVlbeforePunishment": 10,
            "AP": 3
        },
        "killauraF": {
            "enabled": true,
            "description": "Checks for really high hit accuracy",
            "hits": 90,
            "timeMS": 45000,
            "punishment": "ban",
            "punishmentLength": "1d",
            "minVlbeforePunishment": 2,
            "AP": 2
        },
        "hitboxA": {
            "enabled": true,
            "description": "Checks for hitting a player off screen",
            "buffer": 6,
            "minDistance": 2.5,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 2
        },
        "hitboxB": {
            "enabled": false,
            "description": "Traditional hitbox check (Only for desktop and console players, though console is less strict)",
            "max_avg_angle": 50,
            "punishment": "none",
            "minVlbeforePunishment": 5,
            "AP": 2
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
            "minVlbeforePunishment": 10,
            "AP": 3
        },
        "noslowB": {
            "enabled": true,
            "description": "Checks for moving to fast while in cobwebs",
            "speed": 0.22,
            "maxSpeed": 0.36,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "sprintA": {
            "enabled": true,
            "description": "Checks for sprinting with blindness",
            "punishment": "none",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "sprintB": {
            "enabled": true,
            "description": "Checks for sprinting while not pressing correct movement keys",
            "punishment": "kick",
            "minVlbeforePunishment": 10,
            "AP": 1
        },
        "speedA": {
            "enabled": true,
            "description":"Checks for un-natural speeds (Velocity based)",
            "speed": 2.963,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10,
            "AP": 3
        },     
        "speedB": {
            "enabled": true,
            "description": "Checks for known B-Hop velocities",
            "speed": 2.45,
            "velocity": 0.412,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "kick",
            "minVlbeforePunishment": 3,
            "AP": 3
        },  
        "speedC": {
            "enabled": false,
            "description": "Checks for un-natural speeds (Distance based)",
            "velocity": 0.412,
            "max_bps_h": 8,
            "max_bps_v": 36.2,
            "punishment": "kick",
            "minVlbeforePunishment": 3,
            "AP": 3
        },
        "speedD": {
            "enabled": true,
            "description": "Checks for B-Hop cheats",
            "punishment": "kick",
            "minVlbeforePunishment": 20,
            "AP": 3
        },
        "speedE": {
            "enabled":true,
            "description": "Checks for high bpt (Blocks per tick) over a while (Also flags timer cheats)",
            "bpt": 0.4532,
            "maxPredict": 18.75,
            "punishment": "kick",
            "minVlbeforePunishment": 40,
            "AP": 3
        },
        "flyA": {
            "enabled": true,
            "description": "In air velocity check",
            "punishment": "kick", 
            "diff": 0.1,
            "speed": 2.45,
            "punishmentLength": "3d",
            "minVlbeforePunishment": 10,
            "AP": 2
        },    
        "flyB": {
            "enabled": true,
            "description": "Checks for a player keeping 0 y velocity while in air. This is impossible",
            "punishment": "kick",
            "punishmentLength": "5m",
            "minVlbeforePunishment": 30,
            "AP": 3
        },
        "flyC": {
            "enabled": true,
            "description": "Checks for groundspoof (BETA)",
            "punishment": "none",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 50,
            "AP": 3
        }, 
        "flyD": {
            "enabled": false,
            "dist": 1.45,
            "description": "Checks for non BDS based fly (Only use if ur server doesnt use BDS Prediction - Not a realm)",
            "punishment": "none",
            "minVlbeforePunishment": 10,
            "AP": 3
        },
        "motionA": {
            "enabled": true,
            "speed": 11.5,
            "description": "Checks for really high speed",
            "punishment": "ban",
            "punishmentLength": "1h",
            "minVlbeforePunishment": 1,
            "AP": 3
        },
        "motionB": {
            "enabled": true,
            "description": "Checks for really high Y velocity",
            "height": -1.11,
            "punishment": "kick",
            "minVlbeforePunishment": 100,
            "AP": 3
        },
        "predictionA": {
            "enabled": true,
            "description": "Prediction Check",
            "deviationOGF": 0.0001,
            "ogfBuffer": 5,
            "minOffGroundTicksOGF": 4,
            "deviationMain": 0.92,
            "lagback": false,
            "correctVelocity": false,
            "correctPosition": false,
            "punishment": "kick",
            "minVlbeforePunishment": 30,
            "AP": 3
        },
        /*
        World Checks - Checks for breaking and placing blocks.
        */
        "nukerA": {
            "enabled": true,
            "description":"Checks for breaking too many blocks in a tick",
            "maxBlocks": 3,
            "punishment": "none",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "nukerB": {
            "enabled": true,
            "description":"Checks for breaking a bed that is behind you",
            "angle": 90,
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "nukerC": {
            "enabled": true,
            "description":"Checks for breaking a bed that is surrounded by blocks",
            "punishment": "kick",
            "score": -1,
            "minVlbeforePunishment": 1,
            "AP": 3
        },
        "nukerD": {
            "enabled": true,
            "description":"Checks for regen cheats (Hive style)",
            "punishment": "kick",
            "minVlbeforePunishment": 3,
            "AP": 3
        },
        "scaffoldA": {
            "enabled": true,
            "nofalse": false,
            "description": "Checks for scaffold rotation (mainly while diag scaffolding)",
            "punishment": "kick",
            "minVlbeforePunishment": 15,
            "AP": 2
        },
        "scaffoldB": {
            "enabled": true,
            "description": "Checks for common Pitch angles that scaffold cheats can use.",
            "punishment": "ban",
            "punishmentLength": "30m",
            "minVlbeforePunishment": 5,
            "AP": 3
        },
        "scaffoldC": {
            "enabled": true,
            "description": "Checks for placed block not being on players screen",
            "punishment": "kick", 
            "buffer": 18,
            "reset": 2,
            "minVlbeforePunishment": 20,
            "AP": 2
        },
        "scaffoldD": {
            "enabled": true,
            "description":"Checks for a pattern in pitch and yaw angles",
            "punishment": "kick",
            "minVlbeforePunishment": 20,
            "AP": 2
        },
        "scaffoldE": {
            "enabled": true,
            "description": "Checks for going too fast while placing",
            "speed": 2.82,
            "punishment": "kick",
            "minVlbeforePunishment": 1,
            "AP": 2
        },
        "scaffoldF": {
            "enabled": true,
            "description":"Checks for placing too many blocks in 20 ticks",
            "blocksPerSecond": 7,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 2
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
            "minVlbeforePunishment": 5,
            "AP": 2
        },
        "towerB": {
            "enabled": true,
            "description": "Checks for high velocity when towering upwards",
            "velocity": 1,
            "punishment": "kick",
            "minVlbeforePunishment": 5,
            "AP": 2
        },
        "reachC": {
            "enabled": false,
            "description": "Checks for placing or breaking to far away",
            "reach": 7.55,
            "punishment": "kick",
            "minVlbeforePunishment": 2,
            "AP": 1
        },

    
        // Total Checks
        "totalA": {
            "enabled": true, 
            "description": "Checks for too many combat violations in 1 second",
            "max": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
        },
        "totalB": {
            "enabled": true,
            "description": "Checks for too many movement violations in 1 second",
            "max": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
        },      
        "totalC": {
            "enabled": true,
            "description": "Checks for too many packet violations in 1 second",
            "max": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
        }, 
        "totalD": {
            "enabled": true,
            "description": "Checks for too many place/break violations in 1 second",
            "max": 6,
            "punishment": "kick",
            "minVlbeforePunishment": 0,
            "AP": 3
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
            "minVlbeforePunishment": 0,
            "AP": 3
        },

        "commandblockexploitH": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "itemSpawnRateLimit": {
            "enabled": false,
            "entitiesBeforeRateLimit": 45
        },
        "globalBan": {
            "enabled": true,
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
    }
};
