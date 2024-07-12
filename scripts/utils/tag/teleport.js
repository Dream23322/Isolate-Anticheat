import { getSpeed } from "../mathUtil";

const data = new Map();
export function teleportCheck(player) {
    const velocity = player.getVelocity();
    const speed = getSpeed(player);
    const rotation = player.getRotation();
    if(data.get(player.name)) {
        const lastData = data.get(player.name);

        const posDiff = Math.abs(lastData.pos.x - player.location.x) + Math.abs(lastData.pos.y - player.location.y) + Math.abs(lastData.pos.z - player.location.z);
        const velDiff = Math.abs(lastData.vel.x - velocity.x) + Math.abs(lastData.vel.y - velocity.y) + Math.abs(lastData.vel.z - velocity.z);
        const speedDiff = Math.abs(lastData.speed - speed);

        if(rotation.x == 0 && rotation.y == 0) return true;

        if(posDiff > 5) {
            return true;
        }
    }
    data.set(player.name, {pos: player.location, vel: velocity, speed: speed});
    return false;
}