import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import { gravityCheck } from "./predictions/gravityPrediction.js";
import { aroundAir, inAir } from "../../../utils/gameUtil.js";
import { envrionmentAssist } from "./assist/environmentAssist.js";
import * as isomath from "../../../utils/maths/isomath.js";
import { offGroundFriction } from "./predictions/offGroundFriction.js";
import { mainPrediction } from "./predictions/mainPrediction.js";
import * as Minecraft from "@minecraft/server";

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
            let pass = false;

            const lastPositions = [
                { x: player.location.x, y: player.location.y, z: player.location.z, inair: !player.isOnGround && aroundAir(player) },
                positionData.last,
                positionData.last2,
                positionData.last3,
                positionData.last4,
            ];
            // While we don't handle these, don't run the checks as it may cause issues
            for (const tag of badTags) if (player.hasTag(tag)) pass = true;
            for (const effect of badEffects) if (player.getEffect(effect)) pass = true;

            // if(player.hasTag("attacking")) max_deviation += 0.2;
            // if(player.hasTag("jump")) max_deviation += 0.1;
            // if(player.hasTag("damaged")) max_deviation += 1.05;

            if(player.hasTag("velocityDebug")) {
                console.warn(`Velocity: ${player.getVelocity().x.toFixed(3)}, ${player.getVelocity().y.toFixed(3)}, ${player.getVelocity().z.toFixed(3)}`);
            }

            // Prediction/A1 = Gravity stuff
            const gravCheck = gravityCheck(lastPositions, player);

            if(gravCheck.x && !pass) flag(player, "Prediction", "A", "Movement", "gravity", gravCheck.y, true);

            // Prediciton/A2 = Off Ground Friction (Thanks to ethaniccc's Esoteric Anticheat for the idea)
            const offGroundFrictionCheck = offGroundFriction(player, lastPositions);

            if(offGroundFrictionCheck.flag && !pass) {
                player.prediction_ogf_buffer++;
                if(player.prediction_ogf_buffer > config.modules.predictionA.ogfBuffer) {
                    player.prediction_ogf_buffer = 0;
                    flag(player, "Prediction", "A", "Movement", "prediction", offGroundFrictionCheck.data[0].toFixed(6) + " | Diff: " + offGroundFrictionCheck.data[1], true);
                }
            }
            const doMainPrediction = mainPrediction(player, lastPositions, data2.get(player.name));

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
