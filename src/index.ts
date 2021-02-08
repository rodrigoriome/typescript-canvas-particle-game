import Game from './app/Game'
import GameUI from './app/GameUI'

import './public/reset.css'
import './public/style.css'

new Game(new GameUI(document.getElementById('root') as HTMLElement)).main()
