import { flag } from "../../../util";
import config from "../../../data/config.js";

export function badpackets_d(player, lastRotations, lastDiff) {
  if (!config.modules.badpacketsD.enabled) return;

  const currentRotation = player.getRotation().y;
  const yawDiff = Math.abs(currentRotation - lastRotations.get(player));

  const isDerpRotation = 
    (yawDiff === 2 && lastDiff.get(player) === 4) ||
    (yawDiff === 4 && lastDiff.get(player) === 2) ||
    (yawDiff === 2 && lastDiff.get(player) === 2);

  if (isDerpRotation) {
    flag(player, "BadPackets", "D", "Rotation", "yawDiff", yawDiff, true);
  }

  lastRotations.set(player, currentRotation);
  lastDiff.set(player, yawDiff);
}
