import { flag } from "../../../util";
import config from "../../../data/config.js";
import { fastPow } from "../../../utils/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { isAcceleratingUpwards, isLowYVelocity, isYVelocityNormal } from "./assist/gravityPrediction.js";
const data = new Map();

export function prediction_a(player) {
    const badTags = ["damaged", "slime", "elytra", "ice", "op", "flying", "teleport", "speedE_pass"];
    for (const tag of badTags) if(player.hasTag(tag)) return;
    const badEffects = ["speed", "jump_boost", "slowness", "slow_falling", "levitation", "wind_charged"];
    for (const effect of badEffects) if(player.getEffect(effect)) return;
    if (!config.modules.predictionA.enabled) return;
    if (!allowedPlatform(player, config.modules.predictionA.AP)) return;
    
    const positionData = data.get(player.name);
    if (positionData && positionData.last4) {
        if (positionData.last.x !== 0 && positionData.last.y !== 0 && positionData.last.z !== 0 &&
            positionData.last2.x !== 0 && positionData.last2.y !== 0 && positionData.last2.z !== 0 &&
            positionData.last3.x !== 0 && positionData.last3.y !== 0 && positionData.last3.z !== 0 &&
            positionData.last4.x !== 0 && positionData.last4.y !== 0 && positionData.last4.z !== 0) {

            const lastPositions = [
                {x: player.location.x, y: player.location.y, z: player.location.z}, 
                positionData.last, 
                positionData.last2, 
                positionData.last3, 
                positionData.last4
            ];

            const velocities = [];
            for (let i = 0; i < 4; i++) {
                const deltaX = lastPositions[i].x - lastPositions[i + 1].x;
                const deltaY = lastPositions[i].y - lastPositions[i + 1].y;
                const deltaZ = lastPositions[i].z - lastPositions[i + 1].z;
                velocities.push({ deltaX, deltaY, deltaZ });
            }

            // Average the velocities for smoothing
            const avgVelX = velocities.reduce((sum, vel) => sum + vel.deltaX, 0) / velocities.length;
            const avgVelY = velocities.reduce((sum, vel) => sum + vel.deltaY, 0) / velocities.length;
            const avgVelZ = velocities.reduce((sum, vel) => sum + vel.deltaZ, 0) / velocities.length;

            const predictedX = lastPositions[0].x + avgVelX;
            const predictedY = lastPositions[0].y + avgVelY;
            const predictedZ = lastPositions[0].z + avgVelZ;

            const deviation = Math.sqrt(
                fastPow(player.location.x - predictedX, 2) +
                fastPow(player.location.y - predictedY, 2) +
                fastPow(player.location.z - predictedZ, 2)
            );  

            if (Math.abs(player.location.y - predictedY) < 0.2) { 
                if (deviation > config.modules.predictionA.deviation) {
                    flag(player, "Prediction", "A", "Movement", "deviation", deviation, true);
                }
            } else {
                console.warn("Ignoring fall-related deviation.");
            }
            // Check for bad gravity
            if(!isYVelocityNormal(player, lastPositions)) flag(player, "Prediction", "A", "Movement", "validGravity", "false", true);

            // Check for accel upwards mid air
            if(isAcceleratingUpwards(player, lastPositions)) flag(player, "Prediction", "A", "Movement", "accelUpwards", "true", true);
        }
    }

    data.set(player.name, {
        last: { x: player.location.x, y: player.location.y, z: player.location.z },
        last2: positionData?.last || { x: 0, y: 0, z: 0 },
        last3: positionData?.last2 || { x: 0, y: 0, z: 0 },
        last4: positionData?.last3 || { x: 0, y: 0, z: 0 }
    });
}
