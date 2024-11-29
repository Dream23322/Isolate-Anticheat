import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { fastAbs, fastPow, fastSqrt } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { gravityCheck } from "./assist/gravityPrediction.js";
import { aroundAir } from "../../../utils/gameUtil.js";
const data = new Map();
const maxVelo = 10;
const pause = 500; 
export function predictionEngine(player) {
    if (!config.modules.predictionA.enabled) return;
    if (!allowedPlatform(player, config.modules.predictionA.AP)) return;

    const positionData = data.get(player.name);


    const playerVelocity = player.getVelocity();

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
                { x: player.location.x, y: player.location.y, z: player.location.z, inair: !player.isOnGround && aroundAir(player) },
                positionData.last,
                positionData.last2,
                positionData.last3,
                positionData.last4,
            ];
            const { avgVelX, avgVelY, avgVelZ } = smoothVelocity(lastPositions);
            const predictedX = lastPositions[0].x + avgVelX;
            const predictedY = lastPositions[0].y + avgVelY;
            const predictedZ = lastPositions[0].z + avgVelZ;

            const deviation = Math.sqrt(
                fastPow(player.location.x - predictedX, 2) +
                fastPow(player.location.y - predictedY, 2) +
                fastPow(player.location.z - predictedZ, 2)
            );

            if (deviation > 1.3) {
                console.warn(`Large deviation detected: ${deviation.toFixed(3)} (Lag spike compensation)`);
                pass = true;
            }

            
            const badTags = ["damaged", "slime", "elytra", "ice", "op", "flying", "teleport", "speedE_pass"];
            for (const tag of badTags) if (player.hasTag(tag)) pass = true;

            const badEffects = ["speed", "jump_boost", "slowness", "slow_falling", "levitation", "wind_charged"];
            for (const effect of badEffects) if (player.getEffect(effect)) pass = true;

            if(player.hasTag("attacking")) max_deviation += 0.2;
            if(player.hasTag("jump")) max_deviation += 0.1;
            if(player.hasTag("damaged")) max_deviation += 1.05;

            if (fastAbs(player.location.y - predictedY) < 0.2) {
                if (deviation > max_deviation && !pass) {
                    flag(player, "Prediction", "A", "Movement", "deviation", deviation, true);
                }
            }
            if(player.hasTag("velocityDebug")) {
                console.warn(`Velocity: ${player.getVelocity().x.toFixed(3)}, ${player.getVelocity().y.toFixed(3)}, ${player.getVelocity().z.toFixed(3)} | Predicted: ${avgVelX.toFixed(3)}, ${avgVelY.toFixed(3)}, ${avgVelZ.toFixed(3)}`);
            }
            const gravCheck = gravityCheck(lastPositions, player);
            if(gravCheck.x && !pass) flag(player, "Prediction", "A", "Movement", "gravity", gravCheck.y, true);
        }
    }
    
    data.set(player.name, {
        last: { x: player.location.x, y: player.location.y, z: player.location.z, inair: !player.isOnGround && aroundAir(player) },
        last2: positionData?.last || { x: 0, y: 0, z: 0, inair: false },
        last3: positionData?.last2 || { x: 0, y: 0, z: 0, inair: false  },
        last4: positionData?.last3 || { x: 0, y: 0, z: 0, inair: false   }
    });
}
function smoothVelocity(lastPositions) {
    const totalVelX = (lastPositions[0].x - lastPositions[1].x) + (lastPositions[1].x - lastPositions[2].x) + (lastPositions[2].x - lastPositions[3].x);
    const totalVelY = (lastPositions[0].y - lastPositions[1].y) + (lastPositions[1].y - lastPositions[2].y) + (lastPositions[2].y - lastPositions[3].y);
    const totalVelZ = (lastPositions[0].z - lastPositions[1].z) + (lastPositions[1].z - lastPositions[2].z) + (lastPositions[2].z - lastPositions[3].z);
    
    let avgVelX = totalVelX / 3;
    let avgVelY = totalVelY / 3;
    let avgVelZ = totalVelZ / 3;
    
    avgVelX = Math.min(Math.max(avgVelX, -maxVelo),maxVelo);
    avgVelY = Math.min(Math.max(avgVelY, -maxVelo),maxVelo);
    avgVelZ = Math.min(Math.max(avgVelZ, -maxVelo),maxVelo);
    
    return { avgVelX, avgVelY, avgVelZ };
}