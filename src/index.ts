import Engine from './app/Engine'

const engine = new Engine(document.getElementById('root') as HTMLElement)

addEventListener('resize', function() {
    engine.resize()
})
