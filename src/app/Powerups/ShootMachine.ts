import GameState from "../GameState";
import IPowerup from "../IPowerup";

export default class ShootMachine implements IPowerup {
    apply() {
        GameState.projectileAccelMultiplier = 5
    }
}
