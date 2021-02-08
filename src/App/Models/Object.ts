import Positionable from "~/App/Support/Positionable"

export default abstract class Object implements Positionable {
    abstract context: CanvasRenderingContext2D
    abstract xPos: number
    abstract yPos: number
    abstract radius: number

    isCollidingWith(collidable: Positionable) {
        const distance = Math.hypot(
            this.xPos - collidable.xPos,
            this.yPos - collidable.yPos
        )

        return distance - this.radius - collidable.radius < 1
    }
}
