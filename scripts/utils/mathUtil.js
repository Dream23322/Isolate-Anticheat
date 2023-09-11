// Gets player speed
export function getSpeed(player) {
    const playerVelocity = player.getVelocity();
    const playerSpeed = Number(Math.sqrt(Math.abs(playerVelocity.x**2 +playerVelocity.z**2)).toFixed(2));
    return playerSpeed;
}

/**
 * @name isAttackingFromOutsideView - Returns true if a player attacks outside of a specified angle
 * @param {object} player1  - The attacking player
 * @param {object} player2  - The entity that was attacked
 * @param {int} angle - The angle that the function is looking for
 * @example isAttackingFromOutsideView(player, entity, 90)
 * @remarks returns true if the attacked entity isnt inside of a 90 degree range on the attacking entities screen
 */
export function isAttackingFromOutsideView(player1, player2, angle) {
    if (!player1 || !player2) {
        return false; // Invalid player objects
    }

    // Calculate the distance between the two players
    const distance = Math.sqrt(Math.pow(player2.location.x - player1.location.x, 2) + Math.pow(player2.location.y - player1.location.y, 2) + Math.pow(player2.location.z - player1.location.z, 2));

    // Check if the distance is greater than or equal to 2 blocks
    if (distance >= 2) {
        // Get the view direction vector of player1
        const player1ViewDir = player1.getViewDirection();

        // Calculate the vector from player1 to player2
        const player1ToPlayer2 = {
            x: player2.location.x - player1.location.x,
            y: player2.location.y - player1.location.y,
            z: player2.location.z - player1.location.z,
        };

        // Calculate the dot product
        const dotProduct2 = player1ViewDir.x * player1ToPlayer2.x + player1ViewDir.y * player1ToPlayer2.y + player1ViewDir.z * player1ToPlayer2.z;

        // Calculate the magnitude of the vector
        const player1ToPlayer2Magnitude = Math.sqrt(player1ToPlayer2.x * player1ToPlayer2.x + player1ToPlayer2.y * player1ToPlayer2.y + player1ToPlayer2.z * player1ToPlayer2.z);

        // Normalize the dot product
        const normalizedDotProduct2 = dotProduct2 / (player1ToPlayer2Magnitude * Math.sqrt(player1ViewDir.x * player1ViewDir.x + player1ViewDir.y * player1ViewDir.y + player1ViewDir.z * player1ViewDir.z));

        // Convert dot product to angle in degrees
        const angle2 = Math.acos(normalizedDotProduct2) * (180 / Math.PI);

        // Check if angle2 is greater than 90 degrees
        return angle2 > angle;
    }

    return false;
}

export function isAttackingFromAboveOrBelow(player1, player2, angle) {
    if (!player1 || !player2) {
        return false; // Invalid player objects
    }

    // Calculate the distance between the two players
    const distance = Math.sqrt(Math.pow(player2.location.x - player1.location.x, 2) + Math.pow(player2.location.y - player1.location.y, 2) + Math.pow(player2.location.z - player1.location.z, 2));

    // Check if the distance is greater than or equal to 2 blocks
    if (distance >= 2) {
        // Get the view direction vector of player1
        const player1ViewDir = player1.getViewDirection();

        // Calculate the vector from player1 to player2
        const player1ToPlayer2 = {
            x: player2.location.x - player1.location.x,
            y: player2.location.y - player1.location.y,
            z: player2.location.z - player1.location.z,
        };

        // Calculate the dot product
        const dotProduct2 = player1ViewDir.x * player1ToPlayer2.x + player1ViewDir.y * player1ToPlayer2.y + player1ViewDir.z * player1ToPlayer2.z;

        // Calculate the magnitude of the vector
        const player1ToPlayer2Magnitude = Math.sqrt(player1ToPlayer2.x * player1ToPlayer2.x + player1ToPlayer2.y * player1ToPlayer2.y + player1ToPlayer2.z * player1ToPlayer2.z);

        // Normalize the dot product
        const normalizedDotProduct2 = dotProduct2 / (player1ToPlayer2Magnitude * Math.sqrt(player1ViewDir.x * player1ViewDir.x + player1ViewDir.y * player1ViewDir.y + player1ViewDir.z * player1ViewDir.z));

        // Convert dot product to angle in degrees
        const angle2 = Math.acos(normalizedDotProduct2) * (180 / Math.PI);

        // Check if angle2 is greater than the input angle
        return angle2 > angle;
    }

    return false;
}

/**
 * @name getBlocksBetween
 * @remarks Find every possible coordinate between two sets of Vector3's
 * @param {object} pos1 - First set of coordinates
 * @param {object} pos2 - Second set of coordinates
 * @returns {Array} coordinates - Each possible coordinate
 */
export function getBlocksBetween(pos1, pos2) {
    const { x: minX, y: minY, z: minZ} = pos1;
    const { x: maxX, y: maxY, z: maxZ} = pos2;

    const coordinates = [];

    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            for(let z = minZ; z <= maxZ; z++) {
                coordinates.push({x, y, z});
            }
        }
    }

    return coordinates;
}

