import GameState from '../GameState'
import Point from '../Support/Point'
import ObjectAbstract from './ObjectAbstract'

export default class Projectile extends ObjectAbstract {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point
    acceleration: number

    static instances: Projectile[] = []

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
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.acceleration = GameState.projectileAccel * GameState.projectileAccelMultiplier

        Projectile.instances.push(this)
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    update() {
        this.draw()
        this.xPos = this.xPos + (this.velocity.x * this.acceleration);
        this.yPos = this.yPos + (this.velocity.y * this.acceleration);
    }

    destroy() {
        for (let i = 0; i < Projectile.instances.length; i++) {
            const element = Projectile.instances[i];

            if (element === this) {
                Projectile.instances.splice(i, 1)
            }
        }
    }
}
