import debug from 'debug'
import each from 'lodash/each'

const debugLog = debug('commands')

export default class Commands {
  constructor(emitter) {
    this.emitter = emitter
    this.listeners = []
  }

  execute(name) {
    let tail = Array.prototype.slice.call(arguments, 1)
    let args = [ name ].concat(tail)
    debugLog(`${name}, ${JSON.stringify(tail)}`)
    this.emitter.emit.apply(this.emitter, args)
  }

  handle(name, handler) {
    this.listeners.push(
      this.emitter.addListener(name, handler)
    )
  }

  unsubscribe() {
    each(this.listners, listener => listener.remove())
  }
}
