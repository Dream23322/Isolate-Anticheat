import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import config from "../data/config.js";
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
let data = {
    "servertype": "",
    "active": null,
    "strictlevel": null,
    "autoban": null,
    "autokick": null,
    "smartCommands": null,
    "theme": null,
}

export function autoConfigGUI(player) {
    player.playSound("mob.chicken.plop");

    let text = `Hello ${player.name},\n\nThis is autoconfig, a system to configure Isolate Anticheat to best fit your server`;

    const menu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Start", "textures/ui/arrow")
        .button("Exit", "textures/ui/redX1.png");
    
    menu.show(player).then((response) => {
        if(response.selection === 0) displayFirst(player);
        if(response.selection === 1) return;
    });
}
function displayFirst(player) {
    let text = `What type of server/realm do you have?\n- PvP = Something like a kitpvp\n- Vanilla = Something like a plain old SMP\n- Skygen = Skygen\n- Minigames = A server that has Bedwars or Skywars`;
    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    firstMenu.show(player).then((response) => {
        console.log("hi");
        firstQuestion(player);
    });
}

function firstQuestion(player) {
    
    console.warn("herro");
    const optionss = ["PvP", "Vanilla", "Skygen", "Minigames"];
    console.warn("herro1");



    const menu = new MinecraftUI.ModalFormData().title("Isolate Anticheat Autoconfig");
    menu.dropdown("Type", optionss);
    console.warn("herro3")
    menu.show(player).then((response) => {
        if(response.cancled) return;

        data.servertype = response.formValues[0];
        console.warn("herro4")
        displaySecond(player);
    });
    
}
function displaySecond(player) {
    let text = `Is your server active?\n Does it have more than 5 players online most of the day?`;
    console.warn("herro5")
    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        secondQuestion(player);
    })
}
function secondQuestion(player) {


    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .toggle("Active", false);

    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.active = response.formValues[0];
        displayThird(player);
    });
}

function displayThird(player) {
    let text = `How strict do you want the anti cheat to be?`;

    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        thirdQuestion(player);
    })    
}

function thirdQuestion(player) {
    let text = `How strict do you want the anti cheat system to be?`;

    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .slider("Strict Level", 1, 3, 1);

    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.strictlevel = response.formValues[0];
        
        displayFourth(player);
    });
}

function displayFourth(player) {
    let text = `Do you want to autoban players?`;

    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        fourthQuestion(player);
    });
}

function fourthQuestion(player) {
    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .toggle("Autoban", false);

    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.autoban = response.formValues[0];

        displayFifth(player);
    });
}

function displayFifth(player) {
    let text = `Do you want to autokick players?`;

    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        fifthQuestion(player);
    });
}

function fifthQuestion(player) {
    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .toggle("Autokick", false);

    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.autokick = response.formValues[0];

        displaySixth(player);
    });
}

function displaySixth(player) {
    let text = `Do you want to enable smart commands?`;
    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        sixthQuestion(player);
    });
}

function sixthQuestion(player) {
    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .toggle("Smart Commands", false);
    
    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.smartCommands = response.formValues[0];

        displaySeventh(player);
    });
}

function displaySeventh(player) {
    let text = `What theme do you want to use?`;
    const firstMenu = new MinecraftUI.ActionFormData()
        .title("Isolate Anticheat Autoconfig")
        .body(text)
        .button("Ok", "textures/ui/arrow");
    
    firstMenu.show(player).then((response) => {
        seventhQuestion(player);
    });
}

function seventhQuestion(player) {
    const options = ["old", "new", "alice"]
    const menu = new MinecraftUI.ModalFormData()
        .title("Isolate Anticheat Autoconfig")
        .dropdown("Theme", options);
    
    menu.show(player).then((response) => {
        if (response.cancled) return;

        data.theme = response.formValues[0];

        analyseData(player);
    });
}

function analyseData(player) {
    console.warn(data);
    const logs = [];
    let servertype = data.servertype;
    let active = data.active;
    let strictlevel = data.strictlevel;     
    let autoban = data.autoban;
    let autokick = data.autokick;
    let smartCommands = data.smartCommands;
    let theme = data.theme;
    console.warn(servertype)
    if (servertype === 0 || servertype === 1) {
        // Dont need Scaffold Checks or Nuker/B/C
        const moduleData = [
            config["modules"]["scaffoldA"],
            config["modules"]["scaffoldB"],
            config["modules"]["scaffoldC"],
            config["modules"]["scaffoldD"],
            config["modules"]["scaffoldE"],
            config["modules"]["scaffoldF"],
            config["modules"]["towerA"],
            config["modules"]["towerB"],
            config["modules"]["nukerB"],
            config["modules"]["nukerC"]
        ];

        for (const dat of moduleData) {
            // Update config
            dat["enabled"] = false;
            // Update Dynamic Config
            
            logs.push(`Disabled ${dat[1]}`);
        }
        world.setDynamicProperty("config", JSON.stringify(config));
    } else if (servertype === 2) {
        // Dont need Nuker/B/C or strict scaffold checks
        const moduleData = [
            config["modules"]["scaffoldC"],
            config["modules"]["scaffoldE"],
            config["modules"]["towerB"],
            config["modules"]["nukerB"],
            config["modules"]["nukerC"]
        ];
        for (const dat in moduleData) {
            // Update config
            dat["enabled"] = false;

            // Update Dynamic Config
            world.setDynamicProperty("config", JSON.stringify(config));

            logs.push(`Disabled ${dat[1]}`);
        }
    } else if (servertype === 3) {
        
        config["modules"]["towerB"]["punishment"] = "ban";
        logs.push("Punishment Set: Tower(B) | Ban");
        config["modules"]["aimE"]["punishment"] = "kick";
        logs.push("Punishment Set: Aim(E) | Kick");

        // Update Dynamic Config
        world.setDynamicProperty("config", JSON.stringify(config));
    }

    if (active) {
        config["modules"]["aimE"]["enabled"] = false;
        logs.push("Disabled Aim(E)");

        // Update Dynamic Config
        world.setDynamicProperty("config", JSON.stringify(config));
    }

    if(strictlevel === 1) {
        config["modules"]["settings"]["autoBan"] = false;
        logs.push("AutoBan Disabled");
        config["modules"]["settings"]["autoKick"] = true;
        logs.push("AutoKick Enabled");
        config["modules"]["settings"]["silent"] = true;
        logs.push("Silent Enabled");
        config["modules"]["settings"]["kicksBeforeBan"] = 15;
        logs.push("Kick Count Set: 15");
        config["modules"]["killauraD"]["punishment"] = "none";
        logs.push("Punishment Set: Killaura(D) | None");
        config["modules"]["killauraD"]["minVlbeforePunishment"] = 20;
        logs.push("PunishVL Set: Killaura(D) | 20");
        config["modules"]["speedE"]["bpt"] = 0.35
        logs.push("BPT Set: Speed(E) | 0.35");

    } else if(strictlevel === 2) {
        config["modules"]["settings"]["autoBan"] = true;
        logs.push("AutoBan Enabled");
        config["modules"]["settings"]["autoKick"] = true;
        logs.push("AutoKick Enabled");
        config["modules"]["settings"]["silent"] = true;
        logs.push("Silent Enabled");
        config["modules"]["settings"]["kicksBeforeBan"] = 7;
        logs.push("Kick Count Set: 7");
        config["modules"]["killauraD"]["minVlbeforePunishment"] = 20;
        logs.push("PunishVL Set: Killaura(D) | 20");
        config["modules"]["speedE"]["bpt"] = 0.28
        logs.push("BPT Set: Speed(E) | 0.28");
    } else if(strictlevel === 3) {
        config["modules"]["settings"]["autoBan"] = true;
        logs.push("AutoBan Enabled");
        config["modules"]["settings"]["autoKick"] = true;
        logs.push("AutoKick Enabled");
        config["modules"]["settings"]["silent"] = false;
        logs.push("Silent Disabled");
        config["modules"]["settings"]["kicksBeforeBan"] = 7;
        logs.push("Kick Count Set: 7");
        config["modules"]["killauraD"]["minVlbeforePunishment"] = 10;
        logs.push("PunishVL Set: Killaura(D) | 10");
        config["modules"]["speedE"]["bpt"] = 0.271;
        logs.push("BPT Set: Speed(E) | 0.271");
        config["modules"]["speedE"]["punishment"] = "ban";
        logs.push("Punishment Set: Speed(E) | Ban");
        config["modules"]["timerA"]["enabled"] = true;
        logs.push("Timer(A) Enabled");
        config["modules"]["settings"]["autoReset"] = false;
        logs.push("AutoReset Disabled");
        config["modules"]["speedA"]["minVlbeforePunishment"] = 3
        logs.push("PunishVL Set: Speed(A) | 3");
    }

    // Update Dynamic Config
    world.setDynamicProperty("config", JSON.stringify(config));

    if(autoban === true) {
        logs.push("AutoBan Enabled");
        config["modules"]["settings"]["autoBan"] = true;
    } else {
        logs.push("AutoBan Disabled");
        config["modules"]["settings"]["autoBan"] = false;
    }

    if(autokick === true) {
        logs.push("AutoKick Enabled");
        config["modules"]["settings"]["autoKick"] = true;
    } else {
        logs.push("AutoKick Disabled");
        config["modules"]["settings"]["autoKick"] = false;
    } 

    // Update Dynamic Config
    world.setDynamicProperty("config", JSON.stringify(config));
    console.warn(theme)
    if(theme === 0) {
        logs.push("Theme Changed | Old (theme 1)");
        config["modules"]["settings"]["theme"] = "1";
    
    } else if(theme === 1) {
        logs.push("Theme Changed | New (theme 2)");
        config["modules"]["settings"]["theme"] = "2";
    } else if(theme === 2) {
        logs.push("Theme Changed | Alice (theme 3)");
        config["modules"]["settings"]["theme"] = "alice";
    }

    // Update Dynamic Config
    world.setDynamicProperty("config", JSON.stringify(config));                 

    if(smartCommands) {
        logs.push("Smart Commands Enabled");
        config["modules"]["smartReport"]["enabled"] = true;
    }

    // Update Dynamic Config
    world.setDynamicProperty("config", JSON.stringify(config));

    for (const log of logs) {
        player.sendMessage(`§r§j[§uIsolate§j]§r Logs: §h${log}`);
    }
}