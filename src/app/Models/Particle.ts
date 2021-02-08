import GameState from '../GameState'
import Object from '../Models/Object'
import Point from '../Support/Point'

export default class Particle extends Object {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point
    alpha: number
    friction: number

    static instances: Particle[] = []

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
        this.alpha = 1
        this.friction = 0.02

        Particle.instances.push(this)
    }

    draw() {
        this.context.save()
        this.context.globalAlpha = this.alpha
        this.context.beginPath();
        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.restore()
    }

    update() {
        this.draw()

        this.velocity.x *= 1 - this.friction
        this.velocity.y *= 1 - this.friction

        this.xPos = this.xPos + (this.velocity.x * GameState.particleAccel);
        this.yPos = this.yPos + (this.velocity.y * GameState.particleAccel);
        this.alpha -= 0.01
    }

    destroy() {
        for (let i = 0; i < Particle.instances.length; i++) {
            const element = Particle.instances[i];

            if (element === this) {
                Particle.instances.splice(i, 1)
            }
        }
    }
}
