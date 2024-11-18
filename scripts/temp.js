export function configAdder(config) {
    for (let module in config.modules) {
        if(config.modules[module].AP) continue;
        const moduleName = module.split(".")[1];
        if(
            moduleName === "settings" || 
            moduleName === "itemSpawnRateLimit" || 
            moduleName === "globalBan" || 
            moduleName === "examplemoduleA" || 
            moduleName === "filterUnicodeChat" || 
            moduleName == "smartReport"
        ) continue;
        config.modules[module].AP = 3;
    }

    return config;
}