// Three value function
export function three_value(a, b, c) {
    return (
        (Math.abs(a - b) === Math.abs(b - c) && a !== b && b !== c && c !== a) || 
        (a === b && b === c) || 
        (a % 2 === 0 && b % 2 === 0 && c % 2 === 0) 
    );
}

// Four value function
export function four_value(a, b, c, d) {
    return (
        (Math.abs(a - b) === Math.abs(b - c) && Math.abs(b - c) === Math.abs(c - d) && a !== b && b !== c && c !== d && d !== a) ||
        (a === b && b === c && c === d) ||
        (a % 2 === 0 && b % 2 === 0 && c % 2 === 0 && d % 2 === 0)
    );
}

// Five value function
export function five_value(a, b, c, d, e) {
    return (
        (Math.abs(a - b) === Math.abs(b - c) && Math.abs(b - c) === Math.abs(c - d) && Math.abs(c - d) === Math.abs(d - e) && a !== b && b !== c && c !== d && d !== e && e !== a) ||
        (a === b && b === c && c === d && d === e) ||
        (a % 2 === 0 && b % 2 === 0 && c % 2 === 0 && d % 2 === 0 && e % 2 === 0)
    );
}
