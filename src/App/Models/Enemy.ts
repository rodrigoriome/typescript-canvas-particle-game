import GameState from '~/App/GameState'
import Point from '~/App/Support/Point'
import Object from '~/App/Models/Object'

export default class Enemy extends Object {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point

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
        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    update() {
        this.draw()
        this.xPos = this.xPos + (this.velocity.x * GameState.enemyAccel);
        this.yPos = this.yPos + (this.velocity.y * GameState.enemyAccel);
    }

    destroy() {
        for (let i = 0; i < Enemy.instances.length; i++) {
            const element = Enemy.instances[i];

            if (element === this) {
                Enemy.instances.splice(i, 1)
            }
        }
    }
}
