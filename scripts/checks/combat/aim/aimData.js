import { fastAbs } from "../../../utils/fastMath";
import { arrayToList } from "../../../utils/mathUtil";

const pitchPositions = new Map();
const yawPositions = new Map();

const deltaPitchData = new Map();
const deltaYawData = new Map();

/*
This handler is used to get rotation data across all aim checks.
We do this because without it, storing data in each aim check can cause large performance issues
*/

export function run_aim_data() {
    const currentRot = player.getRotation();
    const pPos = pitchPositions.get(player.name) ?? new Array(100).fill(0);
    const yPos = yawPositions.get(player.name) ?? new Array(100).fill(0);

    const dPitch = deltaPitchData.get(player.name) ?? new Array(100).fill(0);
    const dYaw = deltaYawData.get(player.name) ?? new Array(100).fill(0);
    if(pPos && yPos && dPitch && dYaw) {
        const deltaPitch = fastAbs(currentRot.x - pPos[0]);
        const deltaYaw = fastAbs(currentRot.y - yPos[0]);

        dPitch.unshift(deltaPitch);
        dYaw.unshift(deltaYaw);
        if(dPitch.length > 100) dPitch.pop();
        if(dYaw.length > 100) dYaw.pop();
        deltaPitchData.set(player.name, dPitch);
        deltaYawData.set(player.name, dYaw);
    }   

    pitchPositions.set(player.name, currentRot.x);
    yawPositions.set(player.name, currentRot.y);

    deltaPitchData.set(player.name, dPitch);
    deltaYawData.set(player.name, dYaw);
}

export function getDeltaPitch(player) {
    return deltaPitchData.get(player.name)[0];
}

export function getLastDeltaPitch(player) {
    return deltaPitchDataget(player.name)[1];
}

export function getDeltaYaw(player) {
    return deltaYawData.get(player.name)[0];
}

export function detLastDeltaYaw(player) {
    return deltaYawData.get(player.name)[1];
}

export function getDeltaPitchList(player) {
    return deltaPitchData.get(player.name);
}

export function amountDeltaPitch(player, amt) {
    const pitchList = arrayToList(deltaPitchData.get(player.name));
    const amount = amt + 1;
    let counter = 0;
    const returnList = [];
    for (let value of pitchList) {
        if(counter < amount) {
            returnList.push(value);
            counter++;
        } else {
            return returnList;
        }
    }
}



export function getDeltaYawList(player) {
    return deltaYawData.get(player.name);
}

export function amountDeltaYaw(player, amt) {
    const yawList = arrayToList(deltaYawData.get(player.name));
    const amount = amt + 1;
    let counter = 0;
    const returnList = [];
    for (let value of yawList) {
        if(counter < amount) {
            returnList.push(value);
            counter++;
        } else {
            return returnList;
        }
    }
}

export function getRotationPitches(player) {
    return pitchPositions.get(player.name);
}

export function getRotationYaws(player) {
    return yawPositions.get(player.name);
}