import * as mc from "@minecraft/server";
import { flag } from "../../../utils/anticheat/punishment/flag.js";
import * as isomath from "../../../utils/maths/isomath.js";

/**
 * @author jasonlaubb
 * This code is from Matrix-Anticheat and I give full credit to them. The orginal version of this check can be found at:
 * https://github.com/jasonlaubb/Matrix-AntiCheat/blob/rewrite/Matrix_BP/src/program/detection/reach.ts
 */

const MAX_REACH = 4.5;
const MAX_ROTATION = 79;
const TRACK_DURATION = 8000;

const system = mc.system;

/**
 * @typedef {Object} TrackData
 * @property {Vector3[]} locationData
 * @property {number} lastValidTimeStamp
 * @property {number} buffer
 */
let locationTrackData = {};

/**
 * 
 * @param {mc.Player} player 
 * @param {mc.Entity} entityHit 
 */
export function reach_a(player, entityHit) {
	// if(entityHit.typeId !== "minecraft:player" && entityHit.typeId !== "minecraft:villager") return;
    const playerLocationData = locationTrackData[player.id];
    const targetLocationData = locationTrackData[entityHit.id];
    const now = Date.now();
    const playerLocationDataExists = locationTrackData[player.id] !== undefined;
    const targetLocationDataExists = locationTrackData[entityHit.id] !== undefined;
    const playerTrackInvalid = !playerLocationDataExists || now - locationTrackData[player.id].lastValidTimeStamp > TRACK_DURATION;
    const targetTrackInvalid = !targetLocationDataExists || now - locationTrackData[entityHit.id].lastValidTimeStamp > TRACK_DURATION;
    if (playerTrackInvalid) {
        trackPlayer(player);
        locationTrackData[player.id].buffer = 0;
    }
    if (targetTrackInvalid) {
        trackPlayer(entityHit);
    }

    console.warn("[Isolate] >> Reach A");

    locationTrackData[player.id].lastValidTimeStamp = now;
    locationTrackData[entityHit.id].lastValidTimeStamp = now;
    if (targetTrackInvalid || playerTrackInvalid) return;

    const { x: pitch } = player.getRotation();

    if(isomath.abs(pitch) < MAX_ROTATION) {

        const distLimit = calculateDistLimit(pitch);
        const distance = getMinimumDistance(playerLocationData.locationData, targetLocationData.locationData);

        if(distance > distLimit + 1.2 && distance > 3.5) {
            const buffer = ++locationTrackData[player.id].buffer;
            if(buffer >= 4) {
                locationTrackData[player.id].lastValidTimeStamp = 0;
                locationTrackData[player.id].buffer = 0;
                flag(player, "Reach", "A", "Combat", "distance", `${distance},buffer=${buffer}`, false);
            }
        }
    }
}

function trackPlayer(player) {
    const runId = system.runInterval(() => {
        if(!player?.isValid()) {
            system.clearRun(runId);
            return;
        }
        if(!locationTrackData[player.id]) locationTrackData[player.id] = { locationData: [], lastValidTimeStamp: 0, buffer: 0 };
        locationTrackData[player.id].locationData.push(player.location);
        if(locationTrackData[player.id].locationData.length >= 5) {
            locationTrackData[player.id].locationData.shift();
        }
        if(Date.now() - locationTrackData[player.id].lastValidTimeStamp > TRACK_DURATION) {
            system.clearRun(runId);
        }
    });
}

function getMinimumDistance(playerLoc, targetLoc) {
    const playerX = playerLoc.map(({ x }) => x);
    const playerZ = playerLoc.map(({ z }) => z);
    const targetX = targetLoc.map(({ x }) => x);
    const targetZ = targetLoc.map(({ z }) => z);
    const xDiffs = playerX.map((x, i) => {
        return isomath.abs(x - targetX[i]);
    });

    const zDiffs = playerZ.map((z, i) => {
        return isomath.abs(z - targetZ[i]);
    });

    return isomath.pythag(Math.min(...xDiffs), Math.min(...zDiffs));
}

function calculateDistLimit(pitch) {
    return isomath.cos(isomath.abs(pitch)) * MAX_REACH;
}