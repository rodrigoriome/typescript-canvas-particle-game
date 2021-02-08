import gsap from 'gsap'

import Player from "./Objects/Player"
import Projectile from "./Objects/Projectile"
import Enemy from "./Objects/Enemy"
import Particle from "./Objects/Particle"

import GameUI from "./GameUI"
import GameState from "./GameState"

import { getRandomInt } from './Support/Utils'

import '../public/reset.css'
import '../public/style.css'

export default class Engine {
    private _context!: CanvasRenderingContext2D
    private _ui: GameUI
    private _animationFrame!: number
    private _enemySpawnInterval?: NodeJS.Timeout
    private _player!: Player

    private readonly _VIEWPORT_CENTER_X = Math.floor(innerWidth / 2);
    private readonly _VIEWPORT_CENTER_Y = Math.floor(innerHeight / 2);

    constructor(rootElement: HTMLElement) {
        this._ui = new GameUI(rootElement)
        this._context = this._ui.iCanvas.getContext('2d') as CanvasRenderingContext2D

        this.start()
    }

    private start(): void {
        this.resize()
        this.animate()

        this._ui.iRoot.addEventListener('click', (event) => {
            if (GameState.status === 'started') {
                const angle = Math.atan2(
                    event.clientY - this._VIEWPORT_CENTER_Y,
                    event.clientX - this._VIEWPORT_CENTER_X
                )

                new Projectile(
                    this._context,
                    this._VIEWPORT_CENTER_X,
                    this._VIEWPORT_CENTER_Y,
                    5,
                    "white",
                    {
                        x: Math.cos(angle),
                        y: Math.sin(angle),
                    }
                )
            }
        })

        this._ui.iModalStartButton.addEventListener('click', () => {
            this.startGame()
        })
    }

    private startGame(): void {
        this._player = new Player(
            this._context,
            this._VIEWPORT_CENTER_X,
            this._VIEWPORT_CENTER_Y,
            10,
            "white"
        );

        Projectile.instances = []
        Enemy.instances = []
        Particle.instances = []

        this.setScore(0)

        GameState.setDefaultValues()

        this._ui.iModal.style.display = 'none'

        this.spawnEnemies()

        GameState.status = 'started'
    }

    private endGame(): void {
        if (this._enemySpawnInterval) {
            clearInterval(this._enemySpawnInterval)
        }

        this._ui.iModal.style.display = 'block'

        GameState.status = 'over'
    }

    private animate(): void {
        this._animationFrame = requestAnimationFrame(this.animate.bind(this));
        this._context.fillStyle = 'black'
        this._context.fillRect(0, 0, this._ui.iCanvas.width, this._ui.iCanvas.height)

        if (GameState.status === 'started') {
            this._player.draw()

            for (const pwr of GameState.powerups) {
                pwr.apply()
            }

            for (const projectile of Projectile.instances) {
                const isOutOfCanvasBounds = projectile.xPos + projectile.radius < 0
                    || projectile.yPos + projectile.radius < 0
                    || projectile.xPos - projectile.radius > this._ui.iCanvas.width
                    || projectile.yPos - projectile.radius > this._ui.iCanvas.height

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

                if (enemy.isCollidingWith(this._player)) {
                    this.endGame()
                }

                for (const projectile of Projectile.instances) {
                    if (enemy.isCollidingWith(projectile)) {
                        setTimeout(() => {
                            for (let i = 0; i < enemy.radius; i++) {
                                new Particle(
                                    this._context,
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
        }
    }

    private spawnEnemies(): void {
        this._enemySpawnInterval = setInterval(() => {
            const radius = getRandomInt(10, 30)
            let xPos
            let yPos

            if (Math.random() < 0.5) {
                xPos = Math.random() < 0.5 ? 0 - radius : this._ui.iCanvas.width + radius
                yPos = Math.random() * this._ui.iCanvas.height
            } else {
                xPos = Math.random() * this._ui.iCanvas.width
                yPos = Math.random() < 0.5 ? 0 - radius : this._ui.iCanvas.height + radius
            }

            const angle = Math.atan2(
                this._VIEWPORT_CENTER_Y - yPos,
                this._VIEWPORT_CENTER_X - xPos
            )

            new Enemy(
                this._context,
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

    private setScore (value: number): void {
        GameState.score = value

        this._ui.iScoreCounter.innerText = String(value)
        this._ui.iModalScoreCounter.innerText = String(value)
    }

    /**
     * Resizes the canvas to fit the window.
     */
    public resize(): void {
        this._ui.iCanvas.width = window.innerWidth
        this._ui.iCanvas.height = window.innerHeight
    }
}
