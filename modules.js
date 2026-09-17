export default function add(x, y) {
    console.log(x + y);
}

export function sub(x, y) {
    console.log(x - y);
}

export function mul(x, y) {
    console.log(x * y);
}
export function div(x, y) {
    console.log(x / y);
}
export function mod(x, y) {
    console.log(x % y);
}

export function evenOdd(x) {
    if (x % 2 == 0) {
        console.log("Even");
    }
    else {
        console.log("Odd");
    }
}