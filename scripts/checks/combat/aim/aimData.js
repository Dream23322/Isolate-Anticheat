import { arrayToList } from "../../../utils/maths/mathUtil";
import * as isomath from "../../../utils/maths/isomath.js"

const pitchPositions = new Map();
const yawPositions = new Map();

const deltaPitchData = new Map();
const deltaYawData = new Map();

const accelPitchData = new Map();
const accelYawData = new Map();

export let started = false;
/*
This handler is used to get rotation data across all aim checks.
We do this because without it, storing data in each aim check can cause large performance issues
*/

export function run_aim_data(player) {
    const currentRot = player.getRotation();
    const pPos = pitchPositions.get(player.name) ?? new Array(100).fill(0);
    const yPos = yawPositions.get(player.name) ?? new Array(100).fill(0);

    const dPitch = deltaPitchData.get(player.name) ?? new Array(100).fill(0);
    const dYaw = deltaYawData.get(player.name) ?? new Array(100).fill(0);

    const accelPitch = accelPitchData.get(player.name) ?? new Array(100).fill(0);
    const accelYaw = accelYawData.get(player.name) ?? new Array(100).fill(0);
    if(pPos && yPos && dPitch && dYaw) {
        const deltaPitch = isomath.abs(currentRot.x - pPos[0]);
        const deltaYaw = isomath.abs(currentRot.y - yPos[0]);

        dPitch.unshift(deltaPitch);
        dYaw.unshift(deltaYaw);
        if(dPitch.length > 100) dPitch.pop();
        if(dYaw.length > 100) dYaw.pop();

        pPos.unshift(currentRot.x);
        yPos.unshift(currentRot.y);

        if(pPos.length > 100) pPos.pop();
        if(yPos.length > 100) yPos.pop();

        const pitchAccel = isomath.abs(dPitch[0] - dPitch[1]);
        const yawAccel = isomath.abs(dYaw[0] - dYaw[1]);

        accelPitch.unshift(pitchAccel);
        accelYaw.unshift(yawAccel);
        if(accelPitch.length > 100) accelPitch.pop();
        if(accelYaw.length > 100) accelYaw.pop();
    }   

    pitchPositions.set(player.name, pPos);
    yawPositions.set(player.name, yPos);

    deltaPitchData.set(player.name, dPitch);
    deltaYawData.set(player.name, dYaw);



    started = true;
}

export function getDeltaPitch(player) {
    return deltaPitchData.get(player.name)[0];
}

export function getLastDeltaPitch(player) {
    return deltaPitchData.get(player.name)[1];
}

export function getLastLastDeltaPitch(player) {
    return deltaPitchData.get(player.name)[2];
}

export function getDeltaYaw(player) {
    return deltaYawData.get(player.name)[0];
}

export function getLastDeltaYaw(player) {
    return deltaYawData.get(player.name)[1];
}

export function getLastLastDeltaYaw(player) {
    return deltaYawData.get(player.name)[2];
}

export function getDeltaPitchList(player) {
    return arrayToList(deltaPitchData.get(player.name));
}

export function getDeltaPitchArray(player) {
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
    return arrayToList(deltaYawData.get(player.name));
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

export function getAccelPitch(player) {
    return accelPitchData.get(player.name)[0];
}

export function getAccelYaw(player) {
    return accelYawData.get(player.name)[0];
}

export function getAccelPitchList(player) {
    return arrayToList(accelPitchData.get(player.name));
}

export function getAccelYawList(player) {
    return arrayToList(accelYawData.get(player.name));
}

export function amountAccelPitch(player, amt) {
    const pitchList = arrayToList(accelPitchData.get(player.name));
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

export function amountAccelYaw(player, amt) {
    const yawList = arrayToList(accelYawData.get(player.name));
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