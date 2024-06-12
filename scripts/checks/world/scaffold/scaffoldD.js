import { flag } from "../../../util";
import config from "../../../data/config.js";
const scaffold_d_map = new Map();
export function scaffold_d(player, block) {

    // TODO: Redo this because, its not working and now I look back at it, its useless lmao
    if(config.modules.scaffoldD.enabled) {
        if(scaffold_d_map.get(player.name)) {
            const one = scaffold_d_map.get(player.name)?.one;
            const two = scaffold_d_map.get(player.name)?.two;
            const three = scaffold_d_map.get(player.name)?.three;
            const four = scaffold_d_map.get(player.name)?.four;
            //check that these values arent null
            if(
                one && two && three && four
            ) {
                if(/*is_below(player, block.location, one, two, three, four) && */checkDistance(player, block, one, two, three, four)) {
                    flag(player, "Scaffold", "D", "Placement", "distance_patern", "3", true);
                }

            }
        }
        // set map
        scaffold_d_map.set(player.name, {
            one: { x: block.location.x, y: block.location.y, z: block.location.z },
            two: scaffold_d_map.get(player)?.one,
            three: scaffold_d_map.get(player)?.two,
            four: scaffold_d_map.get(player)?.three
        });
    }

    function is_below(player, ...blocks) {
        const playerY = player.location.y;
        let allBelowPlayer = true;
        let allNotLowEnough = true;
    
        for (const block of blocks) {
            const blockY = block.y;
            if (blockY <= playerY || blockY > playerY - 2) {
                allBelowPlayer = false;
                allNotLowEnough = false;
                break;
            } else if (blockY < playerY) {
                allNotLowEnough = false;
            }
        }
    
        return allBelowPlayer && allNotLowEnough;
    }
    function checkDistance(player, block1, block2, block3, block4, block5) {
        const distances = [block1, block2, block3, block4, block5]
            .map(block => Math.hypot(block.x - player.location.x, block.z - player.location.z));

        const [distance5, distance4, distance3, distance2, distance1] = distances.sort((a, b) => a - b);

        return (
            distance5 > distance4 + 0.1 &&
            distance3 > distance4 &&
            distance3 < distance2 &&
            distance2 > distance1
        );
    }
}