/*eslint-env mocha*/
import expect from 'expect'
import EventStore from './eventStore'
import uuid from 'uuid'
import { EventEmitter } from 'fbemitter'

describe('EventStore', () => {
  it('saveEvents', () => {
    let emitter = new EventEmitter()
    let store = new EventStore(emitter)

    let id = uuid.v4()

    let questStarted = {
      name: 'Destroy the One Ring'
    }

    let membersJoined = {
      day: 1,
      members: [
        'Frodo',
        'Sam'
      ]
    }

    store.appendEvents(id, [ questStarted, membersJoined ])

    let events = store.fetchStream(id)

    // console.log(JSON.stringify(events, null, ' '))

    expect(events.length).toEqual(2)
    expect(events[0].data).toEqual(questStarted)
    expect(events[1].data).toEqual(membersJoined)
  })
})
