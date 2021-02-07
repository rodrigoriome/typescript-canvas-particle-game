export default abstract class Positionable {
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
