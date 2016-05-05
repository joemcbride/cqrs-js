/*eslint-env mocha*/
import expect from 'expect'
import { EventEmitter } from 'fbemitter'
import EventStore from '../core/eventStore'
import QuestList from './questList'

import questStarted from './questStarted'

describe('QuestList', ()=> {
  let emitter = new EventEmitter()
  let store = new EventStore(emitter)
  let questList = new QuestList()

  afterEach( ()=> {
    questList.unsubscribe()
    store.store = {}
  })

  it('streams to an aggreate view', ()=> {

    store.streamInlineWith(questList)

    store.addLog((name, ev) => console.log(`New Event: (${ev.version}) ${name}`))

    store.appendEvents(
      '123',
      [
        questStarted('The One Ring')
      ]
    )

    store.appendEvents(
      '345',
      [
        questStarted('The Deed of Paksenarrion')
      ]
    )

    expect(questList.quests.length).toEqual(2)

    expect(questList.quests[0].id).toEqual('123')
    expect(questList.quests[0].name).toEqual('The One Ring')

    expect(questList.quests[1].id).toEqual('345')
    expect(questList.quests[1].name).toEqual('The Deed of Paksenarrion')
  })
})
