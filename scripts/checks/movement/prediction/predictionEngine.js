import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { fastAbs, fastPow, fastSqrt } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { gravityCheck } from "./assist/gravityPrediction.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
import { envrionmentAssist } from "./assist/environmentAssist.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
const data = new Map();
const maxVelo = 10;
const data2 = new Map();
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

            const deviationData = calculateDeviation(player, lastPositions, data2.get(player.name));
            const deviation = deviationData.one;
            const predictedY = deviationData.two;
            if (deviation > 1.3) {
                //console.warn(`Large deviation detected: ${deviation.toFixed(3)} (Lag spike compensation)`);
                pass = true;
            }
            const badTags = ["damaged", "slime", "elytra", "ice", "op", "flying", "teleport", "speedE_pass"];
            for (const tag of badTags) if (player.hasTag(tag)) pass = true;

            const badEffects = ["speed", "jump_boost", "slowness", "slow_falling", "levitation", "wind_charged"];
            for (const effect of badEffects) if (player.getEffect(effect)) pass = true;

            if(player.hasTag("attacking")) max_deviation += 0.2;
            if(player.hasTag("jump")) max_deviation += 0.1;
            if(player.hasTag("damaged")) max_deviation += 1.05;

            if (fastAbs(player.location.y - predictedY) < 0.5) {
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
    data2.set(player.name, 
        { 
            velo: playerVelocity,
            lastVelo: data2.get(player.name)?.velo || { x: 0, y: 0, z: 0 },
            sneak: player.isSneaking,
            ground: player.isOnGround,
        }
    );
}
// No Xcoco, its not chatGPT, I made 90% of it while on a fucking plane 45,000 feet in the sky. How am I meant to use chatgpt there huh?

function calculateDeviation(player, lastPositions, otherData) {
    const playerVelocity = player.getVelocity();
    
    return { one: deviation, two: 
        lastPositions[1] - playerVelocity.y;
    };
}



/*
Velocity Prediction

This is done by getting the position difference between the players position in the last tick and current tick,
then taking other factors such as Speed, Accel, Environmental Factors (Sneak, Sprint, Friction, Slime, etc) and Position History into account.
This should allow for the final deviation to be somewhat precise.

^^^
This most likely won't be made in full for the first release as it will take some time

*/
function calculateVelocityDeviation(player, lastPositions, otherData) {
    const VDTP_RAW = getVelocityDeviationTypePosition(player, lastPositions);
    const VDTH_RAW = getVelocityDeviationTypeHistory(player, lastPositions);

    
}

// Basic position based Velocity prediction.
function getVelocityDeviationTypePosition(player, lastPositions) {
    const playerVelocity = player.getVelocity();
    // Formula: OldPos - CurrentPos

    const predictedVelocityX = lastPositions[1].x - player.location.x;

    // For now we will skip Y calculations as the current gravity prediction works well so there is no reason to do extra calculations which use Memory (RAM) and CPU.
    //const predictedVelocityY = lastPositions[1].y - player.location.y - 1;

    const predictedVelocityZ = lastPositions[1].z - player.location.z;

    return (predictedVelocityX - playerVelocity.x) + (predictedVelocityZ - playerVelocity.z);
}

// TODO: Improve this
// ps: I just have to get this update out.
function getVelocityDeviationTypeHistory(player, lastPositions) {
    /*
    To use position history, we look at the last two position based velocities and using that we can predict the next velocity.
    */
    const oldPositionVelocityX = lastPositions[4].x - lastPositions[3].x;
    const midPositionVelocityX = lastPositions[3].x - lastPositions[2].x;
    const newPositionVelocityX = lastPositions[2].x - lastPositions[1].x;

    return (oldPositionVelocityX + midPositionVelocityX + newPositionVelocityX) / 3;
}