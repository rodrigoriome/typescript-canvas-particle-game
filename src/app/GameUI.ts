export default class GameUI {
    // Interface main elements
    iRoot: HTMLElement
    iCanvas: HTMLCanvasElement

    // Interface container
    iContainer: HTMLElement

    // Interface elements
    iScoreCounter: HTMLElement
    iModal: HTMLElement
    iModalScoreCounter: HTMLElement
    iModalStartButton: HTMLElement

    constructor(rootElement: HTMLElement) {
        this.iRoot = rootElement
        this.iCanvas = document.createElement('canvas')

        this.iContainer = document.createElement('div')
        this.iContainer.classList.add('game__ui')
        this.iContainer.innerHTML = `
        <div class="game__ui-score">
            <span>Score: </span>
            <span id="gameScoreCounter">0</span>
        </div>

        <div class="game__ui-modal" id="gameModal">
            <h1 id="gameModalScore">0</h1>
            <p>Points</p>
            <div>
                <button id="gameStartButton">Start Game</button>
            </div>
        </div>
        `

        this.iScoreCounter = this.iContainer.querySelector('#gameScoreCounter') as HTMLElement
        this.iModal = this.iContainer.querySelector('#gameModal') as HTMLElement
        this.iModalScoreCounter = this.iContainer.querySelector('#gameModalScore') as HTMLElement
        this.iModalStartButton = this.iContainer.querySelector('#gameStartButton') as HTMLElement

        this.iRoot.appendChild(this.iCanvas)
        this.iRoot.appendChild(this.iContainer)
    }
}
