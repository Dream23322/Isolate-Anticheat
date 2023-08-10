import * as from "@minecraft/server";

import { flag } from "../../util";

export function killauraF(obj) {
    // const antiKillAuraBoolean = dynamicPropertyRegistry.get("antikillaura_b");


    const { entity, hitBlock, hitEntity } = obj;

    // if (!(hitEntity instanceof Player) || hitBlock !== undefined || !(entity instanceof Player)) {
    //     return;
    // }

    // const uniqueId = dynamicPropertyRegistry.get(entity?.id);

    // if (uniqueId === entity.name) {
    //     return;
    // }

    const { x: entityX, y: entityY, z: entityZ } = entity.getViewDirection();
    const { x: hitX, y: hitY, z: hitZ } = hitEntity.location;

    const dx = hitX - entity.location.x;
    const dy = hitY - entity.location.y;
    const dz = hitZ - entity.location.z;

    const dotProduct = entityX * dx + entityY * dy + entityZ * dz;
    const entityMagnitude = Math.sqrt(entityX * entityX + entityY * entityY + entityZ * entityZ);
    const vectorMagnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const cosAngle = dotProduct / (entityMagnitude * vectorMagnitude);
    const angle = Math.acos(cosAngle) * (180 / Math.PI);

    if (angle > 100) {
        flag(entity, "KillAura", "A", "Combat", "angle", angle, true);
        rip(entity);
    }
}
