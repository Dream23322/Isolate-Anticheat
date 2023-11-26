import * as Minecraft from "@minecraft/server";
import { flag } from "../../../util";
import config from "../../../data/config.js";

export function scaffold_d(player, block, lastPlacePitch) {
    const rotation = player.getRotation();
    if(config.modules.scaffoldD.enabled) {

        if(lastPlacePitch.get(player)) {
            let pitch_diff = Math.abs(lastPlacePitch.get(player) - rotation.x);
            // List of the differences between the last place and the current rotation
            const rotationDifferences = [
                6.87432861328125,
                1.52850341796875,
                2.228729248046875,
                1.676239013671875,
                2.18382263183594,
                1.66786193847656,
                0.81658935546875,
                0.329559326171875,
                1.72975158691406,
                2.70010375976563,
                1.67823791503906,
                2.16250610351563,
                1.65989685058594,
                1.72856140136719,
                2.23068237304688,
                1.71002197265625,
                2.19158935546875,
                1.69364929199219,
                3.07861328125,
                2.97360992431641,
                2.27449035644531,
                1.44749450683594,
                1.81301116943359,
                1.47972869873047,
                6.05283569335938, 
                9.66135215759277, 
                5.66259765625,   
                8.94805145263672, 
                3.95509338378906, 
                6.14602661132813, 
                2.16079711914062, 
                5.73162841796875, 
                2.68417358398438, 
                6.15313720703125, 
                3.55624389648437, 
                5.67083740234375, 
                1.90574645996094, 
                4.28034973144531, 
                1.79312133789063, 
                4.74583435058594, 
                1.80088806152344, 
                4.53787231445313, 
                1.50727844238281, 
                4.10185241699219, 
                1.50425720214844, 
                4.291748046875,   
                2.2454833984375,  
                3.6058349609375,  
                1.20573425292969, 
                3.21308898925781, 
                1.75494384765625, 
                3.11309814453125, 
                1.71617126464844, 
                3.46534729003906, 
                2.06148529052734, 
                3.11279296875,    
                1.47979736328125, 
                2.68540191650391, 
                1.82327270507812, 
                3.50386047363281, 
                2.54501342773438  
              ];
           // Check if the difference is in the list
            if(rotationDifferences.includes(pitch_diff)) {
                flag(player, "Scaffold", "D", "World", "pitch_diff", pitch_diff, false);
            }
            if(rotation.x > 86 && rotation.x < 87) {
                if(pitch_diff > 0.11 && pitch_diff < 0.5) {
                    flag(player, "Scaffold", "D", "World", "pitch_diff", pitch_diff, false);
                }
            }
            if(rotation.x > 83.04 && rotation.x < 84) {
                if(pitch_diff > 0.011 && pitch_diff < 0.5) {
                    flag(player, "Scaffold", "D", "World", "pitch_diff", pitch_diff, false);
                }
            }
        }
        lastPlacePitch.set(player, rotation.x);
        // If the blocks location is below -64 flag
        if(block.location.y < -64) {
            flag(player, "Scaffold", "D", "World", "location", block.location.y, false);
        }
    }
}