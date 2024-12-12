import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { gravityCheck } from "./assist/gravityPrediction.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
import { envrionmentAssist } from "./assist/environmentAssist.js";
import * as isomath from "../../../utils/maths/isomath.js";
/*

Isolate Anticheat Prediction

This is a prediction engine that works in a really weird way (I pretty much just pulled it out my ass) and can probably be faster and just overall be better. But this is the first real attempt at a prediction type check.
It uses Position and Velocity data to get a deviation from expect Position and Velocity.

There is the option to use fastmaths which can make it run faster as it is... not too heavy but can be if there are a lot of players online.

*/

const badEffects = ["speed", "jump_boost", "slowness", "slow_falling", "levitation", "wind_charged"];
const badTags = ["damaged", "slime", "elytra", "ice", "op", "flying", "teleport", "speedE_pass"];
const data = new Map();
const data2 = new Map();
export function predictionEngine(player) {
    if (!config.modules.predictionA.enabled) return;
    if (!allowedPlatform(player, config.modules.predictionA.AP)) return;

    const positionData = data.get(player.name);
    const playerVelocity = player.getVelocity();

    if (positionData && positionData.last4) {

        // LOL?????
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
            if (deviation > 1.3) {
                //console.warn(`Large deviation detected: ${deviation.toFixed(3)} (Lag spike compensation)`);
                pass = true;
            }

            // While we don't handle these, don't run the checks as it may cause issues
            for (const tag of badTags) if (player.hasTag(tag)) pass = true;
            for (const effect of badEffects) if (player.getEffect(effect)) pass = true;

            if(player.hasTag("attacking")) max_deviation += 0.2;
            if(player.hasTag("jump")) max_deviation += 0.1;
            if(player.hasTag("damaged")) max_deviation += 1.05;


           // if (isomath.abs(player.location.y - player.velocity.y) < 0.5) {
            if (deviation > max_deviation && !pass) {
                flag(player, "Prediction", "A", "Movement", "deviation", deviation, true);
            }
            //}
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


// No Xcoco (or daze tbh), its not chatGPT, I made 90% of it while on a fucking plane 45,000 feet in the sky. How am I meant to use chatgpt there huh?

function calculateDeviation(player, lastPositions, otherData) {
    const velocityDeviationData = calculateVelocityDeviation(player, lastPositions, otherData);
    const positionDeviationData = calculatePositionDeviation(player, lastPositions, otherData, velocityDeviationData.velocity, velocityDeviationData.devition);

    const velocityDeviation = velocityDeviationData.deviation;
    const positionDeviation = positionDeviationData.deviation;

    const totalDeviation = velocityDeviation + positionDeviation;
    // Debug stuff
    if(player.hasTag("simulationDebug")) {
        player.sendMessage(`Velocity Deviation: ${velocityDeviation.toFixed(3)} | Position Deviation: ${positionDeviation.toFixed(3)} | Total Deviation: ${totalDeviation.toFixed(3)}`);
    }

    if(velocityDeviation > positionDeviation) {
        return {
            total: totalDeviation,
            greater: "velocity",
            data: velocityDeviationData.velocity
        }
    } else {
        return {
            total: totalDeviation,
            greater: "position",
            data: positionDeviationData.velocity
        }
    }
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

    if(otherData.lastVelo.x === 0) return null;

    const VDTP = getVelocityDeviationTypePosition(player, lastPositions, otherData);
    const VDTH = getVelocityDeviationTypeHistory(player, lastPositions, otherData);

    // Calculate the final deviation and predicted velocity
    const deviation = VDTP.deviation + VDTH.deviation;
    const predictedVelo = {x: VDTP.velocity.x + VDTH.velocity.x / 2, y: player.velocity.y, z: VDTP.velocity.z + VDTH.velocity.z / 2};

    return {deviation: deviation, velocity: predictedVelo};   
}

// Basic position based Velocity prediction
function getVelocityDeviationTypePosition(player, lastPositions, otherdata) {
    const playerVelocity = player.getVelocity();
    // Formula: OldPos - CurrentPos

    const predictedVelocityX = lastPositions[1].x - player.location.x;

    // For now we will skip Y calculations as the current gravity prediction works well so there is no reason to do extra calculations which use Memory (RAM) and CPU
    //const predictedVelocityY = lastPositions[1].y - player.location.y - 1;

    const predictedVelocityZ = lastPositions[1].z - player.location.z;

    const assistedData = envrionmentAssist(player, predictedVelocityX, predictedVelocityZ, otherdata)

    // Can be more accurrate but can also be slower.
    return {
        deviation: pythag(assistedData.x, assistedData.z, playerVelocity.x, playerVelocity.z),
        velocity: { x: assistedData.x, y: playerVelocity.y, z: assistedData.z }
    }
}

// TODO: Improve this
// ps: I just have to get this update out.
function getVelocityDeviationTypeHistory(player, lastPositions, otherData) {
    /*
    To use position history, we look at the last two position based velocities and using that we can predict the next velocity.
    */
    const playerVelo = player.getVelocity();

    // X
    const oldPositionVelocityX = lastPositions[4].x - lastPositions[3].x;
    const midPositionVelocityX = lastPositions[3].x - lastPositions[2].x;
    const newPositionVelocityX = lastPositions[2].x - lastPositions[1].x;

    const averageX = (oldPositionVelocityX + midPositionVelocityX + newPositionVelocityX) / 3;

    // Z
    const oldPositionVelocityZ = lastPositions[4].z - lastPositions[3].z;
    const midPositionVelocityZ = lastPositions[3].z - lastPositions[2].z;
    const newPositionVelocityZ = lastPositions[2].z - lastPositions[1].z;

    const averageZ = (oldPositionVelocityZ + midPositionVelocityZ + newPositionVelocityZ) / 3;

    // Account for sneaking, friction (.etc)
    const assistedAverages = envrionmentAssist(player, averageX, averageZ, otherData);

    return { deviation: pythag(
        playerVelo.x, playerVelo.z, 
        assistedAverages.x, assistedAverages.z
    ), velocity: { x: assistedAverages.x, y: player.velocity.y, z: assistedAverages.z } };
}


/*

Position Prediction

This attempts to predict the players position based off data from last tick. This is effective as a lot of movement cheats allow for strafing mid air which isn't possible, this movement would be detected by such a check
We can use last position data combined with velocity, accel, possibly input data (this would have to exempt console and mobile), and some other factors which I can't be bothered typing out at 1 am.
This can be a complicated process but is worth it as it can detect nearly all movement cheats.

*/
function calculatePositionDeviation(player, lastPositions, otherData, predictedVelocity, velocityDeviation) {
    const PDTY = getPositionDeviationTypeVelocity(player, lastPositions, otherData, predictedVelocity, velocityDeviation);

    return { deviation: PDTY.deviation, position: PDTY.position };
}

/*

Velocity based position prediction.

This works by using the players last position and adding velocity to that position. You do have to account for other stuff to stop a big deviation.
Another thing that can be done is use the predicted velocity. In this function we make sure that the predicted velocity isnt too far from the players actual velocity to try prevent big deviations that aren't valid.

*/
function getPositionDeviationTypeVelocity(player, lastPositions, otherData, predictedVelocity, velocityDeviation) {
    const old_position = lastPositions[1];
    const playerVelocity = player.getVelocity();
    let newPosition = null;
    if(velocityDeviation > 0.8) {
        newPosition = {
            x: old_position.x + 
            (
                (playerVelocity.x + otherData.velo.x) / 2
            ),
            z: old_position.z +
            (
                (playerVelocity.z + otherData.velo.z) / 2
            )
        }
    } else {
        newPosition = {
            x: old_position +
            (
                (predictedVelocity.x)
            ),
            z: old_position.z +
            (
                (predictedVelocity.z)
            )
        }
    }

    const assisted = envrionmentAssist(player, newPosition.x, newPosition.z, otherData)

    return {deviation: pythag(player.location.x, player.location.z, assisted.x, assisted.z), position: {x: assisted.x, y: player.location.y, z: assisted.z}};
}


function pythag(x1, z1, x2, z2) {
    if(config.modules.predictionA.fastMaths) return isomath.pythag(x1 - x2, z1 - z2);

    return Math.sqrt(
        Math.pow(x1 - x2, 2) +
        Math.pow(z1 - z2, 2)
    )
}

function correctMovement(type, pos, velo) {
    if(type === "velocity") {
        player.setVelocity(velo.x, player.velocity.y, velo.z);
    } else {
        player.teleport(pos,
            {
                keepVelocity: true
            }
        )
    }
}