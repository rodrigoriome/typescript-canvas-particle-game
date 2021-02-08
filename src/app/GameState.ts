import IPowerup from './IPowerup'

export default class GameState {
    static projectileAccel: number = 0
    static projectileAccelMultiplier: number = 0

    static enemyAccel: number = 0
    static particleAccel: number = 0
    static score: number = 0
    static status: 'idle' | 'started' | 'over' = 'idle'

    static powerups: IPowerup[] = []

    static setDefaultValues() {
        GameState.score = 0

        GameState.projectileAccel = 5
        GameState.projectileAccelMultiplier = 1

        GameState.enemyAccel = 1
        GameState.particleAccel = 7
    }
}
