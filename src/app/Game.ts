import gsap from 'gsap'

import Player from "./Models/Player"
import Projectile from "./Models/Projectile"
import Enemy from "./Models/Enemy"
import Particle from "./Models/Particle"

import GameUI from "./GameUI"
import GameState from "./GameState"

import { getRandomInt } from './Utils'

export default class Main {
    ui: GameUI

    context!: CanvasRenderingContext2D
    animationFrame!: number

    enemySpawnInterval?: NodeJS.Timeout

    player!: Player

    readonly VIEWPORT_CENTER_X = Math.floor(innerWidth / 2);
    readonly VIEWPORT_CENTER_Y = Math.floor(innerHeight / 2);

    constructor(rootElement: HTMLElement) {
        this.ui = new GameUI(rootElement)
        this.context = this.ui.iCanvas.getContext('2d') as CanvasRenderingContext2D

        this.main()
    }

    main() {
        this.ui.iCanvas.width = window.innerWidth
        this.ui.iCanvas.height = window.innerHeight

        this.animate()

        this.ui.iRoot.addEventListener('click', (event) => {
            if (GameState.status === 'started') {
                const angle = Math.atan2(
                    event.clientY - this.VIEWPORT_CENTER_Y,
                    event.clientX - this.VIEWPORT_CENTER_X
                )

                new Projectile(
                    this.context,
                    this.VIEWPORT_CENTER_X,
                    this.VIEWPORT_CENTER_Y,
                    5,
                    "white",
                    {
                        x: Math.cos(angle),
                        y: Math.sin(angle),
                    }
                )
            }
        })

        this.ui.iModalStartButton.addEventListener('click', () => {
            this.startGame()
        })
    }

    startGame() {
        this.player = new Player(
            this.context,
            this.VIEWPORT_CENTER_X,
            this.VIEWPORT_CENTER_Y,
            10,
            "white"
        );

        Projectile.instances = []
        Enemy.instances = []
        Particle.instances = []

        this.setScore(0)

        GameState.setDefaultValues()

        this.ui.iModal.style.display = 'none'

        this.spawnEnemies()

        GameState.status = 'started'
    }

    endGame() {
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval)
        }

        this.ui.iModal.style.display = 'block'

        GameState.status = 'over'
    }

    animate() {
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.ui.iCanvas.width, this.ui.iCanvas.height)

        if (GameState.status === 'started') {
            this.player.draw()

            for (const projectile of Projectile.instances) {
                const isOutOfCanvasBounds = projectile.xPos + projectile.radius < 0
                    || projectile.yPos + projectile.radius < 0
                    || projectile.xPos - projectile.radius > this.ui.iCanvas.width
                    || projectile.yPos - projectile.radius > this.ui.iCanvas.height

                if (isOutOfCanvasBounds) {
                    setTimeout(() => {
                        projectile.destroy()
                    }, 0)
                } else {
                    projectile.update()
                }
            }

            for (const enemy of Enemy.instances) {
                enemy.update()

                if (enemy.isCollidingWith(this.player)) {
                    this.endGame()
                }

                for (const projectile of Projectile.instances) {
                    if (enemy.isCollidingWith(projectile)) {
                        setTimeout(() => {
                            for (let i = 0; i < enemy.radius; i++) {
                                new Particle(
                                    this.context,
                                    projectile.xPos,
                                    projectile.yPos,
                                    getRandomInt(1, 4),
                                    enemy.color,
                                    {
                                        x: Math.random() - 0.5,
                                        y: Math.random() - 0.5,
                                    }
                                )
                            }

                            if (enemy.radius - 10 < 10) {
                                this.setScore(GameState.score + 250)
                                enemy.destroy()
                            } else {
                                this.setScore(GameState.score + 100)
                                gsap.to(enemy, {
                                    radius: enemy.radius - 10
                                })
                            }

                            projectile.destroy()
                        }, 0)
                    }
                }
            }

            for (const particle of Particle.instances) {
                if(particle.alpha <= 0) {
                    particle.destroy()
                } else {
                    particle.update()
                }
            }

            if (GameState.score >= 2000) {
                GameState.projectileAccel = 8
                GameState.enemyAccel = 1.5
            }
        }
    }

    spawnEnemies() {
        this.enemySpawnInterval = setInterval(() => {
            const radius = getRandomInt(10, 30)
            let xPos
            let yPos

            if (Math.random() < 0.5) {
                xPos = Math.random() < 0.5 ? 0 - radius : this.ui.iCanvas.width + radius
                yPos = Math.random() * this.ui.iCanvas.height
            } else {
                xPos = Math.random() * this.ui.iCanvas.width
                yPos = Math.random() < 0.5 ? 0 - radius : this.ui.iCanvas.height + radius
            }

            const angle = Math.atan2(
                this.VIEWPORT_CENTER_Y - yPos,
                this.VIEWPORT_CENTER_X - xPos
            )

            new Enemy(
                this.context,
                xPos,
                yPos,
                radius,
                `hsl(${Math.random() * 360}, 50%, 50%)`,
                {
                    x: Math.cos(angle),
                    y: Math.sin(angle),
                }
            )
        }, 1000)
    }

    setScore (value: number) {
        GameState.score = value

        this.ui.iScoreCounter.innerText = String(value)
        this.ui.iModalScoreCounter.innerText = String(value)
    }
}
