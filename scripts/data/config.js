export default
{
    // This config is made for pvp servers so most of the illegal checks are turned off
    "debug": true,
    "flagWhitelist": [],
    // Amount of anticheat kicks a player needs to get before getting perm banned
    "kicksBeforeBan": 10,
    clientSpam: {
        // Change to mute if you want to mute the player who used the horion/zephyr spam message
        "punishment": "ban"
    },
    "ViolationsBeforeBan": 30,

    'ViolationsForKick': 15,
    /*
    By enabling this toggle, you can prevent anybody will scythe op from getting flagged from the anticheat
    Although this may be a useful feature, it can be exploited by hackers to completely disable the anticheat for themselves.
    Enable with caution.
    */
    "disable_flags_from_scythe_op": false,
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
            "aliases": ["support","commands"]
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
        "antigma": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["allowgma","agma"]
        },
        "antigmc": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["allowgmc","agmc"]
        },
        "antigms": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["allowgms","agms"]
        },
        "bedrockvalidate": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["bedrock","bv"]
        },
        "modules": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "npc": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "overridecommandblocksenabled": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["overidecbe","overidecommandblocksenabled","ocbe"]
        },
        "removecommandblocks": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["removecb","rcb"]
        },
        "worldborder": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["wb"]
        },
        "xray": {
            "enabled": true,
            "requiredTags": ["op"]
        },
        "autoclicker": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ac"]
        },
        "autoban": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["ab"]
        },
        "invalidsprint": {
            "enabled": true,
            "requiredTags": ["op"],
            "aliases": ["is"]
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
            "requiredTag": ["op"]
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
        }
    },
    "modules": {
        "itemSpawnRateLimit": {
            "enabled": false,
            "entitiesBeforeRateLimit": 45
        },
        /*
        Enabling this module is higly discouraged, as it breaks items names, enchantments, durability
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
        
        // This exploit has been entirely patched out.
        "crasherA": {
            "enabled": false,
            "punishment": "ban",
            "punishmentLength": "14d",
            "minVlbeforePunishment": 1
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
        "reachA": {
            "enabled": true,
            "reach": 6.65,
            "entities_blacklist": [
                "minecraft:enderman",
                "minecraft:fireball",
                "minecraft:ender_dragon",
                "minecraft:ghast"
            ],
            "punishment": "ban",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 20
        },
        "aimA": {
            "enabled": true,
            "rotSpeed": 120,
            "punishment": "kick",
            "minVlbeforePunishment": 20
        },
        "aimB": {
            "enabed": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "aimC": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10,
        },
        "noslowA": {
            "enabled": true,
            "speed": 0.22,
            "maxSpeed": 0.36,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "noslowB": {
            "enabled": true,
            "speed": 0.22,
            "maxSpeed": 0.36,
            "punishment": "kick",
            "minVlbeforePunishment": 5
        },
        "illegalitemsB": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsC": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "invalidsprintA": {
            "enabled": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsD": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "commandblockexploitF": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 1,
            "banLength": "5d"
        },
        "nukerA": {
            "enabled": false,
            "maxBlocks": 3,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "speedA": {
            "enabled": true,
            "speed": 2.4530837678752038235,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "kick",
            "minVlbeforePunishment": 20
        },     
        "speedB": {
            "enabled": true,
            "speed": 2.45,
            "velocity": 0.412,
            "checkForSprint": false,
            "checkForJump": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },  
        "speedC": {
            "enabled": true,
            "velocity": 0.412,
            "speed": 2.45,
            "velocity": 0.2,
            "punishment": "none"
        },
        "flyA": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "5m",
            "minVlbeforePunishment": 10
        },    
        "flyB": {
            "enabled": true,
            "minVelocity": 0.53234201,
            "punishment": "none",
            "MaxHVelocity": 0.5234,
            "minVlbeforePunishment": 0
        },
        "flyC": {
            "enabled": true,
            "velocity": 0.5423,
            "hVelocity": 0.525,
            "punishment": "ban",
            "punishmentLength": "5m",
            "minVlbeforePunishment": 20
        },          
        "flyD": {
            "enabled": true,
            "Velocity": 0.6,
            "punishment": "kick",
            "punishmentLength": "5m",
            "minVlbeforePunishment": 7
        },    
        "flyE": {
            "enabled": true,
            "hVelocity": 0.512,
            "punishment": "ban",
            "punishmentLength": "5d",
            "minVlbeforePunishment": 15
        },        

        // Do **NOT** enabled
        "flyF": {
            "enabled": false,
            "punishment": "none", 
            "speed": 2.05248273,
            "alsoKick": false,
            "punishmentLength": "3d",
            "minVlbeforePunishment": 10
        },   
        // This scythe check is so very fucking shit it annoys the piss out of me.
        "flyG": {
            "enabled": true,
            "fallDistance": 0,
            "punishment": "ban",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 10
        },
        "illegalitemsE": {
            "enabled": false,
            "punishment": "ban",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
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
        "autoclickerB": {
            "enabled": true,
            "minCPS": 3,
            "maxDeviation": 1, // Adjust this value based on your desired maximum CPS deviation
            "punishment": "none",
            "minVlbeforePunishment": 0,
            "checkCPSAfter": 1000 // Adjust this value to change the interval for CPS checks (in milliseconds)
        },
        "badenchantsA": {
            "enabled": false,
            "levelExclusions": {
                /*
                If your realm uses enchantments with levels higher then vanilla then you need to exclude them here.
                To add an exclusion, add ' "<enchantment name>": <max level> ' below the examples
                Anything in this area will be considered as a comment, and wont take effect,

                "efficiency": 69,
                "sharpness": 420
                */
            },
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "badenchantsB": {
            "enabled": false,
            "multi_protection": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "badenchantsC": {
            "enabled": false,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "badenchantsD": {
            "enabled": false,
            "exclusions": [
                "(+DATA)"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "killauraC": {
            "enabled": true,
            "entities": 2,
            "punishment": "ban",
            "punishmentLength": "3m",
            "minVlbeforePunishment": 5
        },
        "scaffoldB": {
            "enabled": true,
            "punishment": "ban",
            "punishmentLength": "30m",
            "minVlbeforePunishment": 3
        },
        "scaffoldC": {
            "enabled": true,
            "punishment": "kick", 
            "angle": 45,
            "minVlbeforePunishment": 10
        },
        "scaffoldD": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 10
        },
        "illegalitemsF": {
            "enabled": false,
            "length": 33,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        
        // This exploit has been entirely patched out.
        "badpackets3": {
            "enabled": true,
            "punishment": "kick",
            "punishmentLength": "",
            "minVlbeforePunishment": 1
        },
        
        "autoclickerA": {
            "enabled": true,
            "maxCPS": 15,
            "checkCPSAfter": 1000,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "commandblockexploitH": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "badpackets4": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "illegalitemsH": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "autotoolA": {
            "enabled": true,
            "startBreakDelay": 90,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsI": {
            "enabled": false,
            "exclude_scythe_op": true,
            "container_blocks": [
                "minecraft:chest",
                "minecraft:trapped_chest",
                "minecraft:barrel",
                "minecraft:beacon",
                "minecraft:blast_furnace",
                "minecraft:brewing_stand",
                "minecraft:dispenser",
                "minecraft:dropper",
                "minecraft:hopper",
                "minecraft:jukebox",
                "minecraft:lectern",
                "minecraft:smoker"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "killauraD": {
            "enabled": true,
            "punishment": "ban",
            "minVlbeforePunishment": 3
        },
        "illegalitemsJ": {
            "enabled": false,
            "exclude_scythe_op": true,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "illegalitemsK": {
            "enabled": false,
            "exclude_scythe_op": true,
            "entities": [
                "minecraft:chest_boat",
                "minecraft:chest_minecart"
            ],
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "fastuseA": {
            "enabled": true,
            "min_use_delay": 10,
            "max_use_delay": 130,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "badenchantsE": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 1
        },
        "illegalitemsL": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "instabreakA": {
            "enabled": true,
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
        // Flags as scaffold/a because it can detect scaffold :D
        "towerA": {
            "enabled": true,
            "max_y_pos_diff": 0.35,
            "punishment": "ban",
            "minVlbeforePunishment": 15
        },
        "illegalitemsN": {
            "enabled": false,
            "punishment": "none",
            "minVlbeforePunishment": 0
        },
        "velocityA": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "killauraE": {
            "enabled": true
        },
        "speedB": {
            "enabled": true
        },
        "jesusA": {
            "enabled": true
        },
        "criticalsA": {
            "enabled": true,
            "punishment": "kick",
            "minVlbeforePunishment": 0
        },
        "motionA": {
            "enabled": true,
            "speed": 11.5,
            "punishment": "ban",
            "punishmentLength": "30d",
            "minVlbeforePunishment": 2
        },
        "motionB": {
            "enabled": true,
            "height": -1.11,
            "punishment": "kick",
            "minVlbeforePunishment": 100
        },
        "killauraF": {
            "enabled": true,
            "angle": 100,
            "punishment": "kick",
            "minVlbeforePunishment": 3
        },
        "badpackets2": {
            "enabled": true,
            "speed": 7.3,
            "punishment": "ban",
            "punishmentLength": "1m",
            "minVlbeforePunishment": 3
        }

    },
    "misc_modules": {
        "lag_machine": {
            "antiArmorStandCluster": {
                "enabled": true,
                "radius": 5,
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
