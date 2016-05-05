import each from 'lodash/each'
import find from 'lodash/find'
import isFunction from 'lodash/isFunction'

export default class Subscriber {
  constructor() {
    this.handlers = []
    this.listeners = []
  }

  applyChange(event) {

    let canHandle = true
    const canHandleFunc = this['canHandle']
    if(isFunction(canHandleFunc)) {
      canHandle = canHandleFunc.call(this, event)
    }

    if(!canHandle) {
      return
    }

    this.version = event.version

    const maybeBefore = this['beforeEach']
    if(isFunction(maybeBefore)) maybeBefore.call(this, event)

    const maybeFunc = find(this.handlers, { 'name': event.data.eventName })
    if(true === canHandle && maybeFunc && isFunction(maybeFunc.handler)) {
      maybeFunc.handler.call(this, event)
    }

    const maybeAfter = this['afterEach']
    if(isFunction(maybeAfter)) maybeAfter.call(this, event)
  }

  load(events) {
    each(events, event => this.applyChange(event))
  }

  handle(name, handler) {
    this.handlers.push({
      name: name,
      handler: handler
    })
  }

  subscribe(eventName, emitter) {
    let that = this
    this.listeners.push(
      emitter.addListener(eventName, function () { that.applyChange.apply(that, arguments) })
    )
  }

  unsubscribe() {
    each(this.listeners, l => l.remove())
  }
}
