import { getSpeed, arrayToList } from "../../../utils/mathUtil.js";
const data = new Map();
export function dataManager(player) {
    const rotationData = player.getRotation();
    const speedData = getSpeed(player);
    const playerVelocity = player.getVelocity();
    const playerPos = player.location;
    
    const pitchArray = data.get(player.name).rotation.pitch ?? (new Array(30).fill(0));
    const yawArray = data.get(player.name).rotation.yaw ?? (new Array(30).fill(0));
    const speedArray = data.get(player.name).speed ?? (new Array(30).fill(0));
    const velocityArray = data.get(player.name).velocity ?? (new Array(30).fill(0));
    const positionArray = data.get(player.name).position ?? (new Array(30).fill(0));

    pitchArray.unshift(rotationData.x);
    pitchArray.pop();
    yawArray.unshift(rotationData.y);
    yawArray.pop();
    speedArray.unshift(speedData);
    speedArray.pop();
    velocityArray.unshift(playerVelocity.x);
    velocityArray.pop();
    positionArray.unshift(playerPos.x);
    positionArray.pop();

    data.set(player.name, {
        rotation: {
            pitch: pitchArray,
            yaw: yawArray
        },
        speed: speedArray,
        velocity: velocityArray,
        position: positionArray
    });
}

export function getPitch(player) {
    return data.get(player.name).rotation.pitch[0];
}
export function getPitchHistory(player) {
    return arrayToList(data.get(player.name).rotation.pitch);
}

export function getYaw(player) {
    return data.get(player.name).rotation.yaw[0];
}
export function getYawHistory(player) {
    return arrayToList(data.get(player.name).rotation.yaw);
}

export function getSpeedHistory(player) {
    return arrayToList(data.get(player.name).speed);
}

export function getVelocityHistory(player) {
    return arrayToList(data.get(player.name).velocity);
}

export function getPositionHistory(player) {
    return arrayToList(data.get(player.name).position);
}