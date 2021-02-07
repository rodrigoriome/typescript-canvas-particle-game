import Point from '~/App/Types/Point'
import Positionable from '~/App/Models/Positionable'

export default class Particle extends Positionable {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point
    alpha: number
    friction: number

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

        this.xPos = this.xPos + this.velocity.x;
        this.yPos = this.yPos + this.velocity.y;
        this.alpha -= 0.01
    }
}
