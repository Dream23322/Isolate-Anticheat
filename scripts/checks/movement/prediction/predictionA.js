import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastAbs, fastPow, fastSqrt } from "../../../utils/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { isAcceleratingUpwards, isLowYVelocity, isYVelocityNormal } from "./assist/gravityPrediction.js";
const data = new Map();
const lastUpdateMap = new Map();

const PAUSE_THRESHOLD = 500; 
export function prediction_a(player) {
    if (!config.modules.predictionA.enabled) return;
    if (!allowedPlatform(player, config.modules.predictionA.AP)) return;

    const positionData = data.get(player.name);
    const currentTime = Date.now();

    if (lastUpdateMap.has(player.name)) {
        const lastUpdateTime = lastUpdateMap.get(player.name);
        const timeSinceLastUpdate = currentTime - lastUpdateTime;

        if (timeSinceLastUpdate < PAUSE_THRESHOLD) {
            console.log(`Player ${player.name} is paused, skipping check.`);
            return;  
        }
    }

    if (positionData && positionData.last4) {
        if (
            positionData.last.x !== 0 &&
            positionData.last.y !== 0 &&
            positionData.last.z !== 0 &&
            positionData.last2.x !== 0 &&
            positionData.last2.y !== 0 &&
            positionData.last2.z !== 0 &&
            positionData.last3.x !== 0 &&
            positionData.last3.y !== 0 &&
            positionData.last3.z !== 0 &&
            positionData.last4.x !== 0 &&
            positionData.last4.y !== 0 &&
            positionData.last4.z !== 0
        ) {
            let max_deviation = config.modules.predictionA.deviation;
            let pass = false;
            const lastPositions = [
                { x: player.location.x, y: player.location.y, z: player.location.z },
                positionData.last,
                positionData.last2,
                positionData.last3,
                positionData.last4,
            ];

            // const moved = hasMovedSignificantly(player, lastPositions);
            // if (hasLargePositionJump(player, data.get(player.name).last)) {
            //     console.warn(`Large position jump detected for player ${player.name}`);
            //     pass = true;
            // }

            // if (!moved) {
            //     lastUpdateMap.set(player.name, currentTime);
            //     console.log(`Player ${player.name} is paused. Last update time set to ${currentTime}`);
            //     pass = true;  
            // }

            const { avgVelX, avgVelY, avgVelZ } = smoothVelocity(player, lastPositions);
            const predictedX = lastPositions[0].x + avgVelX;
            const predictedY = lastPositions[0].y + avgVelY;
            const predictedZ = lastPositions[0].z + avgVelZ;

            const deviation = Math.sqrt(
                fastPow(player.location.x - predictedX, 2) +
                fastPow(player.location.y - predictedY, 2) +
                fastPow(player.location.z - predictedZ, 2)
            );

            if (deviation > MAX_DEVIATION_THRESHOLD) {
                console.warn(`Large deviation detected: ${deviation.toFixed(3)} (Lag spike compensation)`);
                pass = true;
            }

            
            const badTags = ["damaged", "slime", "elytra", "ice", "op", "flying", "teleport", "speedE_pass"];
            for (const tag of badTags) if (player.hasTag(tag)) pass = true;

            const badEffects = ["speed", "jump_boost", "slowness", "slow_falling", "levitation", "wind_charged"];
            for (const effect of badEffects) if (player.getEffect(effect)) pass = true;

            if(player.hasTag("attacking")) max_deviation += 0.2;
            if(player.hasTag("jump")) max_deviation += 0.1;

            if (fastAbs(player.location.y - predictedY) < 0.2) {
                if (deviation > max_deviation && !pass) {
                    flag(player, "Prediction", "A", "Movement", "deviation", deviation, true);
                }
            } else {
                console.warn("Ignoring fall-related deviation.");
            }

            if (!isYVelocityNormal(player, lastPositions) && !pass) flag(player, "Prediction", "A", "Movement", "validGravity", "false", true);

            if (isAcceleratingUpwards(player, lastPositions) && !pass) flag(player, "Prediction", "A", "Movement", "accelUpwards", "true", true);
        }
    }

    data.set(player.name, {
        last: { x: player.location.x, y: player.location.y, z: player.location.z },
        last2: positionData?.last || { x: 0, y: 0, z: 0 },
        last3: positionData?.last2 || { x: 0, y: 0, z: 0 },
        last4: positionData?.last3 || { x: 0, y: 0, z: 0 }
    });
}


const MAX_DEVIATION_THRESHOLD = 1.3;

const MAX_VELOCITY = 10;

function smoothVelocity(player, lastPositions) {
    const totalVelX = (lastPositions[0].x - lastPositions[1].x) + (lastPositions[1].x - lastPositions[2].x) + (lastPositions[2].x - lastPositions[3].x);
    const totalVelY = (lastPositions[0].y - lastPositions[1].y) + (lastPositions[1].y - lastPositions[2].y) + (lastPositions[2].y - lastPositions[3].y);
    const totalVelZ = (lastPositions[0].z - lastPositions[1].z) + (lastPositions[1].z - lastPositions[2].z) + (lastPositions[2].z - lastPositions[3].z);
    
    let avgVelX = totalVelX / 3;
    let avgVelY = totalVelY / 3;
    let avgVelZ = totalVelZ / 3;
    
    avgVelX = Math.min(Math.max(avgVelX, -MAX_VELOCITY), MAX_VELOCITY);
    avgVelY = Math.min(Math.max(avgVelY, -MAX_VELOCITY), MAX_VELOCITY);
    avgVelZ = Math.min(Math.max(avgVelZ, -MAX_VELOCITY), MAX_VELOCITY);
    
    return { avgVelX, avgVelY, avgVelZ };
}

function hasMovedSignificantly(player, lastPosition) {
    const deltaX = fastAbs(player.location.x - lastPosition.x);
    const deltaY = fastAbs(player.location.y - lastPosition.y);
    const deltaZ = fastAbs(player.location.z - lastPosition.z);
    return deltaX > 0.01 || deltaY > 0.01 || deltaZ > 0.01; 
}

function hasLargePositionJump(player, lastPositions) {
    const maxPositionDelta = 5;

    const deltaX = fastAbs(player.location.x - lastPositions[1].x);
    const deltaY = fastAbs(player.location.y - lastPositions[1].y);
    const deltaZ = fastAbs(player.location.z - lastPositions[1].z);
    
    return deltaX > maxPositionDelta || deltaY > maxPositionDelta || deltaZ > maxPositionDelta;
}