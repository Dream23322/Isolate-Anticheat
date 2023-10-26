import { fly_a } from "./movement/fly_a";
import { fly_b } from "./movement/fly_b";
import { fly_c } from "./movement/fly_c";

export function movement(player) {
    fly_a(player);
    fly_b(player);
    fly_c(player);
}