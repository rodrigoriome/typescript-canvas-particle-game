export default interface Positionable {
    context: CanvasRenderingContext2D
    xPos: number
    yPos: number
    radius: number

    isCollidingWith(collidable: Positionable): boolean
}
