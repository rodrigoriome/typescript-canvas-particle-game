import Game from '~/App/Game'
import GameUI from '~/App/GameUI'

new Game(new GameUI(document.getElementById('root') as HTMLElement)).main()
