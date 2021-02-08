export default class GameState {
    static projectileAccel: number = 0
    static enemyAccel: number = 0
    static particleAccel: number = 0
    static score: number = 0
    static status: 'idle' | 'started' | 'over' = 'idle'
    static powerupFrequency: number

    static setDefaultValues() {
        GameState.score = 0
        GameState.projectileAccel = 5
        GameState.enemyAccel = 1
        GameState.particleAccel = 7
        GameState.powerupFrequency = 3 // Every 3 enemies, 1 will have powerups
    }
}
