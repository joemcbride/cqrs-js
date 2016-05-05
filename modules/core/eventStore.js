import EventDescriptor from './eventDescriptor'
import each from 'lodash/each'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import filter from 'lodash/filter'
import map from 'lodash/map'

class EventStore {

  constructor(emitter) {
    this.emitter = emitter
    this.store = {}
    this.eventLoggers = []
  }

  addLog(logger) {
    this.eventLoggers.push(logger)
  }

  appendEvents(id, events) {
    if (!isArray(events)) events = [ events ]
    let agg = this.store[id]

    if(!agg) {
      agg = {
        id: id,
        events: []
      }
      this.store[id] = agg
    }

    let version = agg.events.length

    each(events, ev => {
      version += 1
      let descriptor = new EventDescriptor(id, ev, version)
      agg.events.push(descriptor)

      this.emitter.emit(ev.eventName, descriptor)

      each(this.eventLoggers, log => {
        log(ev.eventName, descriptor)
      })
    })
  }

  fetchStream(id) {
    let agg = this.store[id]

    if(!agg) {
      throw new Error('Aggregate stream not found')
    }

    return agg.events
  }

  aggregateStream(id, aggregate, version) {
    let eventStream = this.fetchStream(id)

    let filteredStream = eventStream

    if(isNumber(version) && version > -1) {
      filteredStream = filter(eventStream, ev => ev.version <= version)
    }

    aggregate.load(filteredStream)

    return aggregate
  }

  aggregateAllStreams(aggregate, version) {
    each(Object.keys(this.store), id => {
      this.aggregateStream(id, aggregate, version)
    })
  }

  streamInlineWith(aggregate) {
    let eventNames = map(aggregate.handlers, h => h.name)

    each(eventNames, ev => {
      aggregate.subscribe(ev, this.emitter)
    })
  }
}

export default EventStore
