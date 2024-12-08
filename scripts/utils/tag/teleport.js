import { fastAbs } from "../maths/fastMath";
import { getSpeed } from "../maths/mathUtil";
import * as isomath from "../../../utils/maths/isomath.js";
const data = new Map();
export function teleportCheck(player) {
    const velocity = player.getVelocity();
    const speed = getSpeed(player);
    const rotation = player.getRotation();
    if(data.get(player.name)) {
        const lastData = data.get(player.name);

        const posDiff = isomath.abs(lastData.pos.x - player.location.x) + isomath.abs(lastData.pos.y - player.location.y) + isomath.abs(lastData.pos.z - player.location.z);
        const velDiff = isomath.abs(lastData.vel.x - velocity.x) + isomath.abs(lastData.vel.y - velocity.y) + isomath.abs(lastData.vel.z - velocity.z);
        const speedDiff = isomath.abs(lastData.speed - speed);

        if(rotation.x === 0 && rotation.y === 0) return true;

        if(posDiff > 5 && velDiff < 1 && speedDiff < 0.4) {
            return true;
        }
    }
    data.set(player.name, {pos: player.location, vel: velocity, speed: speed});
    return false;
}