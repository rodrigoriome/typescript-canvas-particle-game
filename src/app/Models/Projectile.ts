import GameState from '../GameState'
import Point from '../Support/Point'
import Object from './Object'

export default class Projectile extends Object {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point

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
        this.xPos = this.xPos + (this.velocity.x * GameState.projectileAccel);
        this.yPos = this.yPos + (this.velocity.y * GameState.projectileAccel);
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
