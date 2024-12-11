import * as fastMath from "../../utils/maths/fastMath.js";

/**
 * @name testmath
 * @param {object} message - Message object
 */
export function testmath(message, args) {
    // validate that required params are defined
    if(typeof message !== "object") throw TypeError(`message is type of ${typeof message}. Expected "object".`);

    // Script to compare standard and fastMath functions with stress testing for two-argument functions

    const runAmount = args[0] || 1000;
    const runAmountInt = parseInt(runAmount);
    const player = message.sender;

    const functions = [
        { name: "abs", standard: Math.abs, fast: fastMath.fastAbs, args: [2.718281828459045235360287471352] },
        { name: "floor", standard: Math.floor, fast: fastMath.fastFloor, args: [3.141592653589793238462643383279] },
        { name: "ceil", standard: Math.ceil, fast: fastMath.fastCeil, args: [1.618033988749894848204586834365] },
        { name: "round", standard: Math.round, fast: fastMath.fastRound, args: [1.414213562373095048801688724209] },
        { name: "sqrt", standard: Math.sqrt, fast: fastMath.fastSqrt, args: [2.718281828459045235360287471352] },
        { name: "hypot", standard: Math.hypot, fast: fastMath.fastHypot, args: [3.141592653589793, 1.618033988749894] },
        { name: "exp", standard: Math.exp, fast: fastMath.fastExp, args: [0.693147180559945309417232121458] },
        { name: "pow", standard: Math.pow, fast: fastMath.fastPow, args: [2.718281828459045, 3.141592653589793] },
        { name: "log", standard: Math.log, fast: fastMath.fastLog, args: [2.718281828459045235360287471352] },
        { name: "atan2", standard: Math.atan2, fast: fastMath.fastAtan2, args: [1.618033988749894, 1.414213562373095] },
        { name: "atan", standard: Math.atan, fast: fastMath.fastAtan, args: [0.693147180559945309417232121458] },
        { name: "sin", standard: Math.sin, fast: fastMath.fastSin, args: [3.141592653589793238462643383279] },
        { name: "cos", standard: Math.cos, fast: fastMath.fastCos, args: [1.618033988749894848204586834365] },
        { name: "tan", standard: Math.tan, fast: fastMath.fastTan, args: [0.785398163397448309615660845819] },
    ];

    functions.forEach(function(f) {
        const startStandard = Date.now();

        for (let i = 0; i < runAmountInt; i++) {
            f.standard(...f.args);
        }

        const endStandard = Date.now();

        const standardMS = (endStandard - startStandard);

        const startFast = Date.now();

        for (let i = 0; i < runAmountInt; i++) {
            f.fast(...f.args);
        }

        const endFast = Date.now();

        const fastMS = (endFast - startFast);

        const difference = standardMS - fastMS;

        player.sendMessage(`§r§j[§uIsolate§j]§r ${f.name} Standard Math: ${standardMS}ms`);
        player.sendMessage(`§r§j[§uIsolate§j]§r ${f.name} Fast Math: ${fastMS}ms`);
        player.sendMessage(`§r§j[§uIsolate§j]§r ${f.name} Difference: ${difference}ms`);
    });

    player.sendMessage("§r§j[§uIsolate§j]§r Testing Complete.\n\nThis test may not be 100% accurate.");

    
}
