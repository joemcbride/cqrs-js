import debug from 'debug'
import each from 'lodash/each'
import { EventEmitter } from 'fbemitter'
import EventStore from '../core/eventStore'
import Commands from '../core/commands'

const eventLog = debug('events')

const req = require.context('../commands', true, /^\.\/.*Handlers\.js$/)
const components = req.keys().map(key => req(key))

const emitter = new EventEmitter()
const events = new EventStore(emitter)
const commands = new Commands(emitter)

each(components, c => {
  const comp = new c.default()
  each(comp.handlers, h => commands.handle(h.name, h.handler))
})

events.addLog((name, ev) => eventLog(`(${ev.version}) ${name}, ${JSON.stringify(ev.data)}`))

export default {
  commands,
  emitter,
  events
}
