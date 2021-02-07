import Point from '~/App/@types/Point'
import Positionable from '~/App/Models/Positionable'

export default class Enemy extends Positionable {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string
    velocity: Point

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
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }

    update() {
        this.draw()
        this.xPos = this.xPos + this.velocity.x;
        this.yPos = this.yPos + this.velocity.y;
    }
}
