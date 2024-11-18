export function getPlatformID(player) {
    const platformType = player.clientSystemInfo.platformType;
    if (platformType === "Desktop") return 1;
    else if (platformType === "Console") return 2;
    else if (platformType === "Mobile") return 3;
    else return 4;
}

export function allowedPlatform(player, value) {
    return getPlatformID(player) <= value;
}