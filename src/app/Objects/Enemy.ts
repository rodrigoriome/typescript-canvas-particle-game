import GameState from '../GameState'
import Point from '../Support/Point'
import ObjectAbstract from './ObjectAbstract'
import IPowerup from '../IPowerup'
import ShootMachine from '../Powerups/ShootMachine'

export default class Enemy extends ObjectAbstract {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point

    powerups: IPowerup[] = []

    static instances: Enemy[] = []

    constructor(
        context: CanvasRenderingContext2D,
        xPos: number,
        yPos: number,
        radius: number,
        color: string,
        velocity: Point
    ) {
        super()

        const hasPowerups = (Math.random() * 100) > 75

        if (hasPowerups) {
            this.powerups.push(new ShootMachine())
        }

        this.context = context;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius
        this.color = color;
        this.velocity = velocity;

        Enemy.instances.push(this)
    }

    draw() {
        this.context.beginPath();

        if (this.powerups.length) {
            this.prepareEffects()
        }

        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();

        this.normalizeEffects()
    }

    update() {
        this.draw()
        this.xPos = this.xPos + (this.velocity.x * GameState.enemyAccel);
        this.yPos = this.yPos + (this.velocity.y * GameState.enemyAccel);
    }

    destroy() {
        GameState.powerups.push(...this.powerups)

        for (let i = 0; i < Enemy.instances.length; i++) {
            const element = Enemy.instances[i];

            if (element === this) {
                Enemy.instances.splice(i, 1)
            }
        }
    }

    prepareEffects() {
        this.context.shadowColor = '#f00'
        this.context.shadowBlur = 50
    }

    normalizeEffects() {
        this.context.shadowColor = 'rgba(0, 0, 0, 0)'
        this.context.shadowOffsetX = 0
        this.context.shadowOffsetY = 0
        this.context.shadowBlur = 0
    }
}
