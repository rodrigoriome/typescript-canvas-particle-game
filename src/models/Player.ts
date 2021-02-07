import Positionable from '~/models/Positionable'

export default class Player extends Positionable {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number
    color: string

    constructor(
        context: CanvasRenderingContext2D,
        xPos: number,
        yPos: number,
        radius: number,
        color: string
    ) {
        super()
        this.context = context;
        this.xPos = xPos;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
}
