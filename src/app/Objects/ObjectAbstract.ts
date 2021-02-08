export default abstract class ObjectAbstract {
    abstract context: CanvasRenderingContext2D
    abstract xPos: number
    abstract yPos: number
    abstract radius: number

    isCollidingWith(collidable: ObjectAbstract) {
        const distance = Math.hypot(
            this.xPos - collidable.xPos,
            this.yPos - collidable.yPos
        )

        return distance - this.radius - collidable.radius < 1
    }
}
