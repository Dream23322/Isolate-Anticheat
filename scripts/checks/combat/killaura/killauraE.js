import { flag } from "../../../util";
import config from "../../../data/config.js";
const data = new Map();
const buffer_data = new Map();
export function killaura_e(player, entity) {
    if (!config.modules.killauraE.enabled) return;

    const { x: rotationX } = player.getRotation();
    const rotationData = data.get(player.name) || { one: rotationX };
    const { one, two, three } = rotationData;

    if (Math.abs(rotationX - one) > 0 && Math.abs(rotationX - one) !== rotationX) {
        if (Math.abs(one - two) > 0 && Math.abs(one - two) !== one) {
            if (Math.abs(two - three) > 0 && Math.abs(two - three) !== two) {
                const isKillaura =
                    one - three > 60 &&
                    Math.abs(one - two) < 15 &&
                    Math.abs(rotationX - one) < 15;

                const isExempt = player.hasTag("flying") ||
                    player.hasTag("elytra") ||
                    player.hasTag("trident");

                if (isKillaura && !isExempt) {
                    const buffer = buffer_data.get(player.name) || 0;
                    if (buffer > 3) {
                        const yawValues = `${Math.abs(rotationX - one)},last=${Math.abs(one - two)},lastx2=${Math.abs(two - three)},buff=${buffer},minBuff=3`;
                        flag(player, "Killaura", "E", "Combat (BETA)", "YawVal", yawValues, false);
                    }
                }
            }
        }
    }

    data.set(player.name, { one: two, two: three, three: rotationX });
}
