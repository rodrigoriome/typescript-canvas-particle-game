import gsap from 'gsap'
import Player from '~/models/Player'
import Projectile from '~/models/Projectile'
import Enemy from './models/Enemy';
import Particle from './models/Particle';
import Point from './@types/Point';

const randomMin = (value: number, min: number) => Math.random() * (value - min) + min

export default function () {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const scoreCounterEl = document.getElementById('gameScoreCounter') as HTMLSpanElement
    const startGameButtonEl = document.getElementById('gameStartGameButton') as HTMLButtonElement
    const modalEl = document.getElementById('gameModal') as HTMLDivElement
    const modalScoreEl = document.getElementById('gameModalScore') as HTMLHeadingElement

    // Match viewport size
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const VIEWPORT_CENTER_X = Math.floor(innerWidth / 2);
    const VIEWPORT_CENTER_Y = Math.floor(innerHeight / 2);

    let player: Player
    let projectileInstances: Projectile[]
    let enemyInstances: Enemy[]
    let particleInstances: Particle[]

    function init() {
        player = new Player(ctx, VIEWPORT_CENTER_X, VIEWPORT_CENTER_Y, 10, "white");
        projectileInstances = []
        enemyInstances = []
        particleInstances = []
        set_score(0)
    }

    function spawn_enemies() {
        setInterval(function () {
            const enemyRadius = randomMin(30, 10)
            const enemyColor = `hsl(${Math.random() * 360}, 50%, 50%)`
            let enemyPosX
            let enemyPosY

            if (Math.random() < 0.5) {
                enemyPosX = Math.random() < 0.5 ? 0 - enemyRadius : canvas.width + enemyRadius
                enemyPosY = Math.random() * canvas.height
            } else {
                enemyPosX = Math.random() * canvas.width
                enemyPosY = Math.random() < 0.5 ? 0 - enemyRadius : canvas.height + enemyRadius
            }

            const angle = Math.atan2(
                VIEWPORT_CENTER_Y - enemyPosY,
                VIEWPORT_CENTER_X - enemyPosX
            )

            const enemyVelocity: Point = {
                x: Math.cos(angle),
                y: Math.sin(angle),
            }

            enemyInstances.push(new Enemy(
                ctx,
                enemyPosX,
                enemyPosY,
                enemyRadius,
                enemyColor,
                enemyVelocity
            ))
        }, 1000)
    }

    let score = 0

    function set_score (value: number) {
        score = value
        scoreCounterEl.innerText = String(score)
        modalScoreEl.innerText = String(score)
    }

    let animationFrame: number

    function animate() {
        animationFrame = requestAnimationFrame(animate);
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        player.draw();

        particleInstances.forEach(function(particle, index) {
            if(particle.alpha <= 0) {
                particleInstances.splice(index, 1)
            } else {
                particle.update()
            }
        })

        projectileInstances.forEach(function (projectile, index) {
            projectile.update()

            const isOutOfCanvasBounds = false
                || projectile.xPos + projectile.radius < 0
                || projectile.yPos + projectile.radius < 0
                || projectile.xPos - projectile.radius > canvas.width
                || projectile.yPos - projectile.radius > canvas.height

            if (isOutOfCanvasBounds) {
                setTimeout(function () {
                    projectileInstances.splice(index, 1)
                }, 0)
            }
        })

        enemyInstances.forEach(function (enemy, enemyIndex) {
            enemy.update()

            if (enemy.isCollidingWith(player)) {
                cancelAnimationFrame(animationFrame)
                modalEl.style.display = 'block'
            }

            projectileInstances.forEach(function (projectile, projectileIndex) {
                if (enemy.isCollidingWith(projectile)) {
                    setTimeout(function () {
                        for (let i = 0; i < enemy.radius; i++) {
                            particleInstances.push(new Particle(
                                ctx,
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
                            set_score(score + 250)
                            enemyInstances.splice(enemyIndex, 1)
                        } else {
                            set_score(score + 100)
                            gsap.to(enemy, {
                                radius: enemy.radius - 10
                            })
                        }

                        projectileInstances.splice(projectileIndex, 1)
                    }, 0)
                }
            })
        })
    }

    addEventListener("click", function (event) {
        const angle = Math.atan2(
            event.clientY - VIEWPORT_CENTER_Y,
            event.clientX - VIEWPORT_CENTER_X
        )

        const accel = 10

        const velocity = {
            x: Math.cos(angle) * accel,
            y: Math.sin(angle) * accel,
        }

        projectileInstances.push(new Projectile(
            ctx,
            VIEWPORT_CENTER_X,
            VIEWPORT_CENTER_Y,
            5,
            "white",
            velocity
        ))
    });

    startGameButtonEl.addEventListener('click', function (event) {
        init()
        animate()
        spawn_enemies()
        modalEl.style.display = 'none'
    })
}
