// @ts-check
import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";

import config from "../data/config.js";
import data from "../data/data.js";
import { parseTime, capitalizeFirstLetter } from "../util.js";
import { addOp, removeOp } from "../commands/moderation/op.js";

const world = Minecraft.world;

const playerIcons = [
    "textures/ui/icon_alex.png",
    "textures/ui/icon_steve.png",
];
const icons = {
    back: "textures/ui/arrow_left.png",
    anvil: "textures/ui/anvil_icon.png",
    member: "textures/ui/permissions_member_star.png",
    op: "textures/ui/op.png",
    info: "textures/ui/infobulb.png",
    mute_off: "textures/ui/mute_off.png",
    mute_on: "textures/ui/mute_on.png",
    debug: "textures/ui/debug_glyph_color.png",
    arrow: "textures/ui/arrow.png"
};
const moduleList = Object.keys(config.modules).concat(Object.keys(config.misc_modules));
const modules = [];

for(const fullModule of moduleList) {
    if(fullModule.startsWith("example")) continue;
    const module = fullModule[fullModule.length - 1].toUpperCase() === fullModule[fullModule.length - 1] ? fullModule.slice(0, fullModule.length - 1) : fullModule;

    if(modules.includes(module)) continue;
    modules.push(module);
}

const punishments = {
    none: 0,
    mute: 1,
    kick: 2,
    ban: 3
};

const punishmentSettings = ["punishment","punishmentLength","minVlbeforePunishment"];
// this is the function that will be called when the player wants to open the GUI
// all other GUI functions will be called from here
export function mainGui(player, error) {
    player.playSound("mob.chicken.plop");

    let text = `Hello ${player.name},\n\nPlease select an option below.`;
    if(error) text += `\n\n§c${error}`;

    const menu = new MinecraftUI.ActionFormData()
		.title("Isolate Anticheat UI")
		.body(text)
		.button("Ban Menu", "textures/ui/anvil_icon.png")
        .button("Configure Settings", "textures/ui/gear.png")
        .button(`Manage Players\n§8§o${[...world.getPlayers()].length} player(s) online`, "textures/ui/FriendsDiversity.png")
        .button("Server Options", "textures/ui/servers.png")
        .button("Exit", "textures/ui/redX1.png")
        .button("Logs", "textures/ui/WarningGlyph.png")
        .button("AdminLogs", icons.op);
    if(config.debug) menu.button("⭐ Debug", "textures/ui/debug_glyph_color.png");
    
    menu.show(player).then((response) => {
        if(response.selection === 0) banMenu(player);
        if(response.selection === 1) settingsMenu(player);
        if(response.selection === 2) playerSettingsMenu(player);
        if(response.selection === 3) worldSettingsMenu(player);
        if(response.selection === 4) return;
        if(response.selection === 5) logsMenu(player);
        if(response.selection === 6) adminLogsMenu(player);
        if(config.debug && response.selection === 7) debugSettingsMenu(player);
        
    });
}

function logsMenu(player) {
    player.playSound("mob.chicken.plop");
    let logs = data.recentLogs;          
    let text = "";
    for (let i = 0; i < logs.length; i++) {
        text = text + logs[i] + "\n";
    }
    const menu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Logs")
        .body(`"Logs since last restart"\n\n${text}`)
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 4) return;
    });
}

function adminLogsMenu(player) {
    player.playSound("mob.chicken.plop");
    let logs = data.recentAdminLogs;          
    let text = "";
    for (let i = 0; i < logs.length; i++) {
        text = text + logs[i] + "\n";
    }
    const menu = new MinecraftUI.ActionFormData()
        .title("Admin Logs")
        .body(`Admin Logs since last restart\n\n${text}`)
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 4) return;
    });
}

// ====================== //
//        Ban Menu        //
// ====================== //
function banMenu(player) {
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Ban Menu")
        .body("Please select an option.")
        .button("Kick Player", "textures/ui/anvil_icon.png")
        .button("Ban Player", "textures/ui/anvil_icon.png")
        .button("Unban Player", "textures/ui/anvil_icon.png")
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 3 || response.canceled) return mainGui(player);

        if(response.selection === 2) return unbanPlayerMenu(player);
        
        banMenuSelect(player, response.selection);
    });
}

function banMenuSelect(player, selection) {
    player.playSound("mob.chicken.plop");
    const allPlayers = world.getPlayers();

    const menu = new MinecraftUI.ActionFormData()
        .title("Ban Menu")
        .body("Please select a player to manage.");
    
    for(const plr of allPlayers) {
        let playerName = `${plr.name}`;
        if(plr.id === player.id) playerName += " §1[YOU]";
        if(plr.hasTag("op")) playerName += " §1[OP]";
        menu.button(playerName, playerIcons[Math.floor(Math.random() * playerIcons.length)]);
    }

    menu.button("Back", "textures/ui/arrow_left.png");

    menu.show(player).then((response) => {
        if(response.canceled) return banMenu(player);

        // @ts-expect-error
        if([...allPlayers].length > response.selection) {
            // @ts-expect-error
            if(selection === 0) kickPlayerMenu(player, [...allPlayers][response.selection]);
            // @ts-expect-error
            if(selection === 1) banPlayerMenu(player, [...allPlayers][response.selection]);
        } else banMenu(player);
    });
}

function kickPlayerMenu(player, playerSelected, lastMenu = 0) {
    if(!config.customcommands.kick.enabled) return player.sendMessage("§r§j[§uIsolate§j]§r Kicking players is disabled in config.js.");
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()
        .title("Kick Player Menu - " + playerSelected.name)
        .textField("Kick Reason:", "§o§7No Reason Provided")
        .toggle("Silent", false);
    menu.show(player).then((response) => {
        if(response.canceled) {
            switch (lastMenu) { 
                case 0: 
                    banMenuSelect(player, lastMenu);
                    break;
                case 1:
                    playerSettingsMenuSelected(player, playerSelected);
            }
            return;
        }

        const data_ = String(response.formValues).split(",");

        const isSilent = data_.pop();
        const reason = data_.join(",").replace(/"|\\/g, "") || "No Reason Provided";

        if(!isSilent) player.runCommandAsync(`kick "${playerSelected.name}" ${reason}`);
        playerSelected.triggerEvent("scythe:kick");
        const adminData = `${player.nameTag} kicked ${playerSelected.name} (Silent:${isSilent}). Reason: ${reason}`;
        // @ts-ignore
        data.recentAdminLogs.push(adminData);
        player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has kicked ${playerSelected.name} (Silent:${isSilent}). Reason: ${reason}"}]}`);
    });
}

function banPlayerMenu(player, playerSelected, lastMenu = 0) {
    if(!config.customcommands.kick.enabled) return player.sendMessage("§r§j[§uIsolate§j]§r Banning players is disabled in config.js.");

    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()
        .title("Ban Player Menu - " + playerSelected.name)
        .textField("Ban Reason:", "§o§7No Reason Provided")
        .slider("Ban Length (in days)", 0, 365, 1)
        .toggle("Permanant Ban", true);
    menu.show(player).then((response) => {
        if(response.canceled) {
            if(lastMenu === 0) banMenuSelect(player, lastMenu);
            if(lastMenu === 1) playerSettingsMenuSelected(player, playerSelected);
            return;
        }

        const data_ = String(response.formValues).split(",");

        const shouldPermBan = data_.pop();

        let banLength = data_.pop();
        // @ts-expect-error
        if(banLength != 0) banLength = parseTime(`${banLength}d`);

        const reason = data_.join(",").replace(/"|\\/g, "") || "No Reason Provided";

        // remove old ban tags
        playerSelected.getTags().forEach(t => {
            t = t.replace(/"/g, "");
            if(t.startsWith("reason:") || t.startsWith("by:") || t.startsWith("time:")) playerSelected.removeTag(t);
        });
        if(playerSelected.hasTag("op")){ 
            playerSelected.sendMessage(`§r§j[§uIsolate§j]§r ${playerSelected.name} is an Isolate Operator and cannot be banned!`)
        } else {
            playerSelected.addTag(`reason:${reason}`);
            playerSelected.addTag(`by:${player.nameTag}`);
            if(banLength && shouldPermBan === "false") playerSelected.addTag(`time:${Date.now() + banLength}`);
            playerSelected.addTag("isBanned");
            const adminData = `${player.nameTag} banned ${playerSelected.nameTag} (Perm:${shouldPermBan}). Reason: ${reason} Length: ${banLength}`;
            // @ts-ignore
            data.recentAdminLogs.push(adminData);

            player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has banned ${playerSelected.nameTag}. Reason: ${reason}"}]}`);
        }
    });
}

function unbanPlayerMenu(player) {
    if(!config.customcommands.unban.enabled) return player.sendMessage("§r§j[§uIsolate§j]§r Kicking players is disabled in config.js.");
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ModalFormData()
        .title("Unban Player Menu")
        .textField("Player to unban:", "§o§7Enter player name")
        .textField("Unban Reason:", "§o§7No Reason Provided");
    menu.show(player).then((response) => {
        if(response.canceled) return banMenu(player);

        const responseData = String(response.formValues).split(",");

        // @ts-expect-error
        const playerToUnban = responseData.shift().split(" ")[0];

        const reason = responseData.join(",").replace(/"|\\/g, "") || "No Reason Provided";

        // @ts-expect-error
        data.unbanQueue.push(playerToUnban.toLowerCase());

        const adminData = `${player.nameTag} added ${playerToUnban} into the unban queue. Reason: ${reason}`;
        // @ts-ignore
        data.recentAdminLogs.push(adminData);

        player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.nameTag} has added ${playerToUnban} into the unban queue. Reason: ${reason}"}]}`);
    });
}

// ====================== //
//     Settings Menu      //
// ====================== //
function settingsMenu(player) {
    player.playSound("mob.chicken.plop");
    if(player.hasTag("noUIAccess")) return player.sendMessage("§r§j[§uIsolate§j]§r §cYou do not have access to this menu!");
    const settings_menu = new MinecraftUI.ActionFormData()
        .title("Module Settings")
        .body("Please select a sub-check to edit.");

    for(const subModule of modules) {
        settings_menu.button(capitalizeFirstLetter(subModule));
    }

    settings_menu.button("Back", icons.back);

    settings_menu.show(player).then((response) => {
        if(!modules[response.selection ?? -1]) return mainGui(player);

        settingsCheckSelectMenu(player, response.selection);
    });
}

function settingsCheckSelectMenu(player, selection) {
    player.playSound("mob.chicken.plop");
    const subCheck = modules[selection];

    const menu = new MinecraftUI.ActionFormData()
        .title("Configure Settings")
        .body("Please select a check to edit.");

    const checks = [];
    for(const module of moduleList) {
        if(!module.startsWith(subCheck)) continue;
        checks.push(module);

        const checkData = config.modules[module] ?? config.misc_modules[module];
        menu.button(`${capitalizeFirstLetter(subCheck)}/${module[module.length - 1]}\n${checkData.enabled ? "§a(Enabled)" : "§4(Disabled)"}`);
    }

    if(checks.length === 1) return editSettingMenu(player, checks[0]);

    menu.button("Back", icons.back);

    menu.show(player).then((response) => {
        const selection = response.selection ?? - 1;

        if(!checks[selection]) return settingsMenu(player);

        editSettingMenu(player, checks[selection]);
    });
}

function editSettingMenu(player, check) {
    player.playSound("mob.chicken.plop");
    const checkData = config.modules[check] ?? config.misc_modules[check];

    let optionsMap = [];

    const menu = new MinecraftUI.ModalFormData()
        .title(`Editing check: ${capitalizeFirstLetter(check)}`);

    for(const key of Object.keys(checkData)) {
        if(punishmentSettings.includes(key)) continue;

        // Friendly setting name. Changes "multi_protection" to "Multi Protection"
        const settingName = capitalizeFirstLetter(key).replace(/_./g, (match) => " " + match[1].toUpperCase());

        switch(typeof checkData[key]) {
            case "number":
                menu.slider(settingName, 0, 100, Number.isInteger(checkData[key]) ? 1 : 0.01, checkData[key]);
                optionsMap.push(key);
                break;
            case "boolean":
                menu.toggle(settingName, checkData[key]);
                optionsMap.push(key);
                break;
            case "string":
                menu.textField(settingName, "Enter text here", checkData[key]);
                optionsMap.push(key);
                break;
        }
    }

    // Check if the module supports punishments
    if(checkData.punishment) {
        menu.dropdown("Punishment", Object.keys(punishments), punishments[checkData.punishment]);
        menu.textField("Punishment Length", "Enter a ban length (ex: 12d, 1d, 1m, 30s", checkData["punishmentLength"]);
        menu.slider("Minimum Violations (flags) Before Punishment", 0, 20, 1, checkData["minVlbeforePunishment"]);

        optionsMap = optionsMap.concat(punishmentSettings);
    }

    menu.show(player).then((response) => {
        if(response.canceled) return;

        const formValues = response.formValues ?? [];

        for(const optionid in optionsMap) {
            const name = optionsMap[optionid];

            // @ts-expect-error
            checkData[name] = name === "punishment" ? Object.keys(punishments)[formValues[optionid]] : formValues[optionid];
        }

        // Save config
        world.setDynamicProperty("config", JSON.stringify(config));

        const adminData = `${player.nameTag} updated ${check} with \n${JSON.stringify(formValues, null, 2)}`;

        data.recentAdminLogs.push(adminData);
        player.sendMessage(`§r§j[§uIsolate§j]r Successfully updated the settings for ${check}.\n§r§j[§uIsolate§j]§r New Data:\n${JSON.stringify(checkData, null, 2)}`);
    });
}

// ====================== //
//       Player Menu      //
// ====================== //
function playerSettingsMenu(player) {
    player.playSound("mob.chicken.plop");
    const allPlayers = world.getPlayers();

    const menu = new MinecraftUI.ActionFormData()
        .title("Player Menu")
        .body("Please select a player to manage.");
    
    for(const plr of allPlayers) {
        let playerName = `${plr.name}`;
        if(plr.id === player.id) playerName += " §9[YOU]";
        if(plr.hasTag("op")) playerName += " §9[OP]";
        menu.button(playerName, playerIcons[Math.floor(Math.random() * playerIcons.length)]);
    }

    menu.button("Back", "textures/ui/arrow_left.png");

    menu.show(player).then((response) => {
        // @ts-expect-error
        if([...allPlayers].length > response.selection) playerSettingsMenuSelected(player, [...allPlayers][response.selection]);
            else mainGui(player);
    });
}

export function playerSettingsMenuSelected(player, playerSelected) {
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Player Menu - " + player.name)
        .body(`Managing ${playerSelected.name}.\n\nPlayer Info:\nCoordinates: ${Math.floor(playerSelected.location.x)}, ${Math.floor(playerSelected.location.y)}, ${Math.floor(playerSelected.location.z)}\nDimension: ${(playerSelected.dimension.id).replace("minecraft:", "")}\nIsolate Opped: ${playerSelected.hasTag("op")}\nMuted: ${playerSelected.hasTag("isMuted")}\nFrozen: ${playerSelected.hasTag("freeze")}\nVanished: ${playerSelected.hasTag("vanish")}\nFlying: ${playerSelected.hasTag("flying")}`)
        .button("Clear EnderChest", "textures/blocks/ender_chest_front.png")
        .button("Kick Player", "textures/ui/anvil_icon.png")
        .button("Ban Player", "textures/ui/anvil_icon.png");

    if(!playerSelected.hasTag("flying")) menu.button("Enable Fly Mode", "textures/ui/levitation_effect.png");
        else menu.button("Disable Fly Mode", "textures/ui/levitation_effect.png");

    if(!playerSelected.hasTag("freeze")) menu.button("Freeze Player", "textures/ui/icon_winter.png");
        else menu.button("Unfreeze Player", "textures/ui/icon_winter.png");
    
    if(!playerSelected.hasTag("isMuted")) menu.button("Mute Player", "textures/ui/mute_on.png");
        else menu.button("Unmute Player", "textures/ui/mute_off.png");

    if(!playerSelected.hasTag("op")) menu.button("Set Player as Isolate-Op", "textures/ui/op.png");
        else menu.button("Remove Player as Isolate-Op", "textures/ui/permissions_member_star.png");

    if(!playerSelected.hasTag("vanish")) menu.button("Vanish Player", "textures/ui/invisibility_effect.png");
        else menu.button("Unvanish Player", "textures/ui/invisibility_effect.png");

    menu
        .button("Teleport", "textures/ui/arrow.png")
        .button("Switch Gamemode", "textures/ui/op.png")
        .button("View Anticheat Logs", "textures/ui/WarningGlyph.png")
        .button('Check For Killaura','textures/ui/WarningGlyph.png')
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        switch (response.selection) {
            // brackets to ignore eslint errors
            case 0: {
                if(!config.customcommands.ecwipe.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Enderchest wiping is disabled in config.js.");
                }

                let isOp;
                if(playerSelected.hasTag("op")) {
                    isOp = true;
                    removeOp(playerSelected);
                }
                playerSelected.runCommandAsync("function tools/ecwipe")
                    .then(() => isOp && addOp(playerSelected));
                player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${playerSelected.name} has cleared ${player.name}'s enderchest."}]}`);
                break;
            }
            case 1:
                kickPlayerMenu(player, playerSelected, 1);
                break;
            case 2:
                banPlayerMenu(player, playerSelected, 1);
                break;
            case 3:
                if(!config.customcommands.fly.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Toggling Fly is disabled in config.js.");
                }

                if(playerSelected.hasTag("flying")) {
                    playerSelected.runCommandAsync("function tools/fly");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has disabled fly mode for ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                } else {
                    playerSelected.runCommandAsync("function tools/fly");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has enabled fly mode for ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                }
                break;
            case 4:
                if(!config.customcommands.freeze.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Toggling Frozen State is disabled in config.js.");
                }

                if(playerSelected.hasTag("freeze")) {
                    playerSelected.runCommandAsync("function tools/freeze");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has unfrozen for ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                } else {
                    playerSelected.runCommandAsync("function tools/freeze");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has frozen for ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                }
                break;
            case 5:
                if(!config.customcommands.mute.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Muting players is disabled in config.js.");
                }

                if(playerSelected.hasTag("isMuted")) {
                    playerSelected.removeTag("isMuted");
                    playerSelected.runCommandAsync("ability @s mute false");
                }
                break;
            case 6:
                if(!config.customcommands.op.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Isolate-Opping players is disabled in config.js.");
                }

                if(playerSelected.hasTag("op")) {
                    removeOp(playerSelected);
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has given ${playerSelected.name} isolate-op status."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                } else {
                    addOp(playerSelected);
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has removed isolate-op status from ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                }
                break;
            case 7:
                if(!config.customcommands.vanish.enabled) {
                    return player.sendMessage("§r§j[§uIsolate§j]§r Toggling Vanish is disabled in config.js.");
                }

                if(playerSelected.hasTag("vanished")) {
                    playerSelected.runCommandAsync("function tools/vanish");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has put ${playerSelected.name} into vanish."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                } else {
                    playerSelected.runCommandAsync("function tools/vanish");
                    player.runCommandAsync(`tellraw @a[tag=op] {"rawtext":[{"text":"§r§j[§uIsolate§j]§r ${player.name} has unvanished ${playerSelected.name}."}]}`);
                    playerSettingsMenuSelected(player, playerSelected);
                }
                break;
            case 8:
                playerSettingsMenuSelectedTeleport(player, playerSelected);
                break;
            case 9:
                playerSettingsMenuSelectedGamemode(player, playerSelected);
                break;
            case 10:
                playerSelected.runCommandAsync("function tools/stats");
                break;
            case 11:
                playerSelected.runCommandAsync('function tools/aura');
                break;    
            case 12:
                playerSettingsMenu(player);
                break;
        }

        if(response.canceled) playerSettingsMenu(player);
    });
}

function playerSettingsMenuSelectedTeleport(player, playerSelected) {
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Teleport Menu")
        .body(`Managing ${playerSelected.name}.`)
        .button("Teleport To", "textures/ui/arrow.png")
        .button("Teleport Here", "textures/ui/arrow_down.png")
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 0) player.runCommandAsync(`tp @s "${playerSelected.name}"`);
        if(response.selection === 1) player.runCommandAsync(`tp "${playerSelected.name}" @s`);
        if(response.selection === 2 || response.canceled) playerSettingsMenuSelected(player, playerSelected);
    });
}

function playerSettingsMenuSelectedGamemode(player, playerSelected) {
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Gamemode Menu")
        .body(`Managing ${playerSelected.name}.`)
        .button("Gamemode Creative", "textures/ui/op.png")
        .button("Gamemode Survival", "textures/ui/permissions_member_star.png")
        .button("Gamemode Adventure", "textures/ui/permissions_visitor_hand.png")
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 0) player.runCommandAsync(`gamemode 1 "${playerSelected.nameTag}"`);
        if(response.selection === 1) player.runCommandAsync(`gamemode 0 "${playerSelected.nameTag}"`);
        if(response.selection === 2) player.runCommandAsync(`gamemode 2 "${playerSelected.nameTag}"`);
        if(response.selection === 3 || response.canceled) playerSettingsMenuSelected(player, playerSelected);
    });
}

// ====================== //
//       World Menu       //
// ====================== //
// Might get cancled
function worldSettingsMenu(player) {
    player.playSound("mob.chicken.plop");
   // mainGui(player, "This menu is currently under development, check back later! This might be cancled");
    const menu = new MinecraftUI.ActionFormData()
        .title("§2World Menu")
        .body("For managing world settings")
        .button("§4 Enable PvP", "textures/ui/debug_glyph_color.png")
        .button("Enable Keep Inventory", "textures/ui/debug_glyph_color.png")
        .button("Back", "textures/ui/arrow_left.png")
    menu.show(player).then((response) => {
        if(response.selection === 0) player.runCommandAsync("gamerule pvp true");
        if(response.selection === 1) player.runCommandAsync("gamerule keepinventory true");
        if(response.selection === 2) mainGui(player);
    })    

}

// ====================== //
//       Debug Menu       //
// ====================== //
function debugSettingsMenu(player) {
    player.playSound("mob.chicken.plop");

    const menu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat UI")
        .body(`Hello ${player.name},\n\nPlease select an option below.`)
        .button("Disable Debug Intents", "textures/ui/debug_glyph_color.png")
        .button("Randomize Inventory", "textures/ui/debug_glyph_color.png")
        .button("Force Watchdog Stackoverflow", "textures/ui/debug_glyph_color.png")
        .button("Force Watchdog Hang", "textures/ui/debug_glyph_color.png")
        .button("Force Watchdog Memory Crash Type 1", "textures/ui/debug_glyph_color.png")
        .button("Operator Blocks", "textures/ui/debug_glyph_color.png")
        .button("Back", "textures/ui/arrow_left.png");
    menu.show(player).then((response) => {
        if(response.selection === 0) {
            config.debug = false;
            mainGui(player);
        } else if(response.selection === 1) {
            const container = player.getComponent("inventory").container;

            const totalItems = [];
            for (let i = 0; i < 36; i++) {
                if(container.getItem(i)?.nameTag === config.customcommands.ui.ui_item_name) continue;

                const allItems = [...Object.keys(Minecraft.MinecraftItemTypes)];
                const randomItemName = allItems[Math.floor(Math.random() * allItems.length)];
                const randomItem = Minecraft.MinecraftItemTypes[randomItemName];

                if(totalItems.includes(randomItem.id) || config.itemLists.cbe_items.includes(randomItem.id) || config.itemLists.items_semi_illegal.includes(randomItem.id) || config.itemLists.items_very_illegal.includes(randomItem.id) || randomItemName.includes("element")) {
                    i--;
                    continue;
                }
                totalItems.push(randomItem.id);

                container.setItem(i, new Minecraft.ItemStack(randomItem, 1));
            }
        } else if(response.selection === 2) {
            const troll = () => {
                troll();
            };
            troll();
        } else if(response.selection === 3) {
            // eslint-disable-next-line no-constant-condition
            while(true) {}
        } else if(response.selection === 4) {
            config.array = [config];
            // eslint-disable-next-line no-constant-condition
            while(true) {
                config.array.push(config);
            }
        } else if(response.selection === 6) {
            player.runCommandAsync("give @s command_block 64");
            player.runCommandAsync("give @s repeating_command_block 64");
            player.runCommandAsync("give @s chain_command_block 64");
            player.runCommandAsync("give @s structure_block 64");
            player.runCommandAsync("give @s structure_void 64");
            player.runCommandAsync("give @s deny 64");
            player.runCommandAsync("give @s allow 64");
            player.runCommandAsync("give @s barrier 64");
            player.runCommandAsync("give @s light_block 64 1");
            player.runCommandAsync("give @s light_block 64 2");
            player.runCommandAsync("give @s light_block 64 3");
            player.runCommandAsync("give @s light_block 64 4");
            player.runCommandAsync("give @s light_block 64 5");
            player.runCommandAsync("give @s light_block 64 6");
            player.runCommandAsync("give @s light_block 64 7");
            player.runCommandAsync("give @s light_block 64 8");
            player.runCommandAsync("give @s light_block 64 9");
            player.runCommandAsync("give @s light_block 64 10");
            player.runCommandAsync("give @s light_block 64 11");
            player.runCommandAsync("give @s light_block 64 12");
            player.runCommandAsync("give @s light_block 64 13");
            player.runCommandAsync("give @s light_block 64 14");
            player.runCommandAsync("give @s light_block 64 15");
            player.runCommandAsync("give @s border_block 64");
        } else if(response.selection === 7 || response.canceled) mainGui(player);
    });
}

// very epic