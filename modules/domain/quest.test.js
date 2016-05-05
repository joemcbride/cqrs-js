/*eslint-env mocha*/
import expect from 'expect'
import { EventEmitter } from 'fbemitter'
import EventStore from '../core/eventStore'
import Quest from './quest'
import each from 'lodash/each'

import questStarted from './questStarted'
import membersJoined from './membersJoined'

describe('Quest', ()=> {
  let emitter = new EventEmitter()
  let store = new EventStore(emitter)
  let id = '123'
  let quest = new Quest(id)

  afterEach( ()=> {
    quest.unsubscribe()
    store.store = {}
    store.eventLoggers = []
  })

  it('fetch an aggreate event stream', ()=> {

    store.appendEvents(
      id,
      [
        questStarted('The One Ring'),
        membersJoined(1, 'Hobbiton', [ 'Frodo', 'Sam' ]),
        membersJoined(2, 'Buckland', [ 'Merry', 'Pippen' ]),
        membersJoined(10, 'Bree', [ 'Aragorn' ])
      ]
    )

    let eventStream = store.fetchStream(id)

    expect(eventStream.length).toEqual(4)
  })

  it('streams to an aggreate', ()=> {

    store.streamInlineWith(quest)

    store.addLog((name, ev) => console.log(`New Event: (${ev.version}) ${name}`))

    store.appendEvents(
      id,
      [
        questStarted('The One Ring'),
        membersJoined(1, 'Hobbiton', [ 'Frodo', 'Sam' ]),
        membersJoined(2, 'Buckland', [ 'Merry', 'Pippen' ]),
        membersJoined(10, 'Bree', [ 'Aragorn' ])
      ]
    )

    each(quest.log, l => console.log(l))

    expect(quest.name).toEqual('The One Ring')

    let eventStream = store.fetchStream(id)

    each(eventStream, evt => {
      console.log(evt.version, evt.data)
    })
  })

  it('can initialize aggreate to version', ()=> {

    store.addLog((name, ev) => console.log(`New Event: (${ev.version}) ${name}`))

    store.appendEvents(
      id,
      [
        questStarted('The One Ring'),
        membersJoined(1, 'Hobbiton', [ 'Frodo', 'Sam' ]),
        membersJoined(2, 'Buckland', [ 'Merry', 'Pippen' ]),
        membersJoined(10, 'Bree', [ 'Aragorn' ])
      ]
    )

    let result = store.aggregateStream(id, quest, 3)

    each(quest.log, l => console.log(l))

    expect(result.version).toEqual(3)
  })
})
