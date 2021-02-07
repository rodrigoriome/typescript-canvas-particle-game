export default class GameUI {
    root: HTMLElement
    canvas: HTMLCanvasElement
    scoreCounter: HTMLElement
    modal: HTMLElement
    modalScoreCounter: HTMLElement
    modalStartButton: HTMLElement

    constructor(rootEl: HTMLElement) {
        this.root = rootEl
        this.canvas = this.root.querySelector('#gameCanvas') as HTMLCanvasElement
        this.scoreCounter = this.root.querySelector('#gameScoreCounter') as HTMLSpanElement
        this.modal = this.root.querySelector('#gameModal') as HTMLDivElement
        this.modalScoreCounter = this.root.querySelector('#gameModalScore') as HTMLHeadingElement
        this.modalStartButton = this.root.querySelector('#gameStartGameButton') as HTMLButtonElement
    }
}
