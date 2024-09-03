import { fastAbs } from "../fastMath";
import { getSpeed } from "../mathUtil";

const data = new Map();
export function teleportCheck(player) {
    const velocity = player.getVelocity();
    const speed = getSpeed(player);
    const rotation = player.getRotation();
    if(data.get(player.name)) {
        const lastData = data.get(player.name);

        const posDiff = fastAbs(lastData.pos.x - player.location.x) + fastAbs(lastData.pos.y - player.location.y) + fastAbs(lastData.pos.z - player.location.z);
        const velDiff = fastAbs(lastData.vel.x - velocity.x) + fastAbs(lastData.vel.y - velocity.y) + fastAbs(lastData.vel.z - velocity.z);
        const speedDiff = fastAbs(lastData.speed - speed);

        if(rotation.x == 0 && rotation.y == 0) return true;

        if(posDiff > 5 && velDiff < 1 && speedDiff < 0.4) {
            return true;
        }
    }
    data.set(player.name, {pos: player.location, vel: velocity, speed: speed});
    return false;
}