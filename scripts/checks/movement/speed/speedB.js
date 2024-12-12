import { flag } from "../../../utils/anticheat/punishment/flag.js";
import config from "../../../data/config.js";
import { getSpeed } from "../../../utils/maths/mathUtil.js";
import { abs } from "../../../utils/maths/fastMath.js";
import { allowedPlatform } from "../../../utils/platformUtils.js";
import * as isomath from "../../../utils/maths/isomath.js";
export function speed_b(player) {
  if(!allowedPlatform(player, config.modules.speedB.AP)) return;
    const speed = getSpeed(player);
    const velocity = player.getVelocity();

    const yVelocity = isomath.abs(velocity.y).toFixed(4);
    const isPredictedYVelocity = ["0.1000", "0.6000", "0.8000", "0.9000", "0.0830", "0.2280", "0.3200", "0.2302", "0.0428", "0.1212", "0.0428", "1.0244", "0.3331"]
      .includes(yVelocity);

    if (config.modules.speedB.enabled && speed > 0.2 && !player.hasTag("damaged") && !player.hasTag("ice") && !player.hasTag("slime") && !player.isFlying && !player.hasTag("spec") && !player.hasTag("gmc") && isPredictedYVelocity && !player.isJumping && !player.hasTag("teleport")) {
        flag(player, "Speed", "B", "Movement", "y-Velocity", yVelocity, true);
    }
}
