import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { gravityCheck } from "./assist/gravityPrediction.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
import { envrionmentAssist } from "./assist/environmentAssist.js";
import * as isomath from "../../../utils/maths/isomath.js";

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
