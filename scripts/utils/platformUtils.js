export function getPlatformID(player) {
    const platformType = player.clientSystemInfo.platformType;
    if (platformType === "Desktop") return 1;
    else if (platformType === "Console") return 2;
    else if (platformType === "Mobile") return 3;
    // This was changed to fix a disabler where setting ur platform to anything but the 3 above would allow you to fully bypass isolate
    // Thanks ip_atomic
    else return 1;
}

export function allowedPlatform(player, value) {
    return getPlatformID(player) <= value;
}