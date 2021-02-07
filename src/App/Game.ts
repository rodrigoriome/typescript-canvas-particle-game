import gsap from 'gsap'

import Player from "~/App/Models/Player"
import Projectile from "~/App/Models/Projectile"
import Enemy from "~/App/Models/Enemy"
import Particle from "~/App/Models/Particle"

import GameUI from "~/App/GameUI"
import Point from "~/App/Types/Point"

const randomMin = (value: number, min: number) => Math.random() * (value - min) + min

export default class Game {
    gameUi: GameUI

    context!: CanvasRenderingContext2D
    animationFrame!: number

    enemySpawnInterval?: NodeJS.Timeout

    score: number
    status: 'idle' | 'started' | 'over'

    // The Player
    player!: Player

    // Instances
    projectileInstances!: Projectile[]
    enemyInstances!: Enemy[]
    particleInstances!: Particle[]

    readonly VIEWPORT_CENTER_X = Math.floor(innerWidth / 2);
    readonly VIEWPORT_CENTER_Y = Math.floor(innerHeight / 2);

    constructor(gameUi: GameUI) {
        this.gameUi = gameUi
        this.context = this.gameUi.canvas.getContext('2d') as CanvasRenderingContext2D

        this.score = 0
        this.status = 'idle'
    }

    main() {
        this.gameUi.canvas.width = window.innerWidth
        this.gameUi.canvas.height = window.innerHeight

        this.animate()

        this.gameUi.root.addEventListener('click', (event) => {
            const angle = Math.atan2(
                event.clientY - this.VIEWPORT_CENTER_Y,
                event.clientX - this.VIEWPORT_CENTER_X
            )

            const accel = 10

            const velocity = {
                x: Math.cos(angle) * accel,
                y: Math.sin(angle) * accel,
            }

            this.projectileInstances.push(new Projectile(
                this.context,
                this.VIEWPORT_CENTER_X,
                this.VIEWPORT_CENTER_Y,
                5,
                "white",
                velocity
            ))
        })

        this.gameUi.modalStartButton.addEventListener('click', () => {
            this.start_game()
        })
    }

    start_game() {
        this.player = new Player(
            this.context,
            this.VIEWPORT_CENTER_X,
            this.VIEWPORT_CENTER_Y,
            10,
            "white"
        );

        this.projectileInstances = []
        this.enemyInstances = []
        this.particleInstances = []
        this.set_score(0)

        this.gameUi.modal.style.display = 'none'

        this.spawn_enemies()

        this.status = 'started'
    }

    end_game() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval)
        }

        this.gameUi.modal.style.display = 'block'

        this.status = 'over'

        // cancelAnimationFrame(this.animationFrame)
    }

    animate() {
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.gameUi.canvas.width, this.gameUi.canvas.height)

        if (this.status === 'started') {
            this.player.draw()

            this.projectileInstances.forEach((projectile, index) => {
                projectile.update()

                const isOutOfCanvasBounds = false
                    || projectile.xPos + projectile.radius < 0
                    || projectile.yPos + projectile.radius < 0
                    || projectile.xPos - projectile.radius > this.gameUi.canvas.width
                    || projectile.yPos - projectile.radius > this.gameUi.canvas.height

                if (isOutOfCanvasBounds) {
                    setTimeout(() => {
                        this.projectileInstances.splice(index, 1)
                    }, 0)
                }
            })

            this.enemyInstances.forEach((enemy, enemyIndex) => {
                enemy.update()

                if (enemy.isCollidingWith(this.player)) {
                    this.end_game()
                }

                this.projectileInstances.forEach((projectile, projectileIndex) => {
                    if (enemy.isCollidingWith(projectile)) {
                        setTimeout(() => {
                            for (let i = 0; i < enemy.radius; i++) {
                                this.particleInstances.push(new Particle(
                                    this.context,
                                    projectile.xPos,
                                    projectile.yPos,
                                    randomMin(4, 1),
                                    enemy.color,
                                    {
                                        x: (Math.random() - 0.5) * (Math.random() * 6),
                                        y: (Math.random() - 0.5) * (Math.random() * 6),
                                    }
                                ))
                            }

                            if (enemy.radius - 10 < 5) {
                                this.set_score(this.score + 250)
                                this.enemyInstances.splice(enemyIndex, 1)
                            } else {
                                this.set_score(this.score + 100)
                                gsap.to(enemy, {
                                    radius: enemy.radius - 10
                                })
                            }

                            this.projectileInstances.splice(projectileIndex, 1)
                        }, 0)
                    }
                })
            })

            this.particleInstances.forEach((particle, index) => {
                if(particle.alpha <= 0) {
                    this.particleInstances.splice(index, 1)
                } else {
                    particle.update()
                }
            })
        }
    }

    spawn_enemies() {
        this.enemySpawnInterval = setInterval(() => {
            const radius = randomMin(30, 10)
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`
            let xPos
            let yPos

            if (Math.random() < 0.5) {
                xPos = Math.random() < 0.5 ? 0 - radius : this.gameUi.canvas.width + radius
                yPos = Math.random() * this.gameUi.canvas.height
            } else {
                xPos = Math.random() * this.gameUi.canvas.width
                yPos = Math.random() < 0.5 ? 0 - radius : this.gameUi.canvas.height + radius
            }

            const angle = Math.atan2(
                this.VIEWPORT_CENTER_Y - yPos,
                this.VIEWPORT_CENTER_X - xPos
            )

            const enemyVelocity: Point = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            }

            this.enemyInstances.push(new Enemy(
                this.context,
                xPos,
                yPos,
                radius,
                color,
                enemyVelocity
            ))
        }, 1000)
    }

    set_score (value: number) {
        this.score = value

        this.gameUi.scoreCounter.innerText = String(value)
        this.gameUi.modalScoreCounter.innerText = String(value)
    }
}
